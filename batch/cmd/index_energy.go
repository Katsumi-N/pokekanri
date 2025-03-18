package cmd

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"

	"github.com/elastic/go-elasticsearch"
	"github.com/elastic/go-elasticsearch/esapi"
	_ "github.com/go-sql-driver/mysql"
)

type Energy struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	ImageURL    string `json:"image_url"`
	Description string `json:"description"`
	Regulation  string `json:"regulation"`
	Expansion   string `json:"expansion"`
}

func FeedEnergy() {
	dsn := "root:pass@tcp(localhost:13306)/pokekanridb"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening database: %s", err)
	}
	defer db.Close()

	es, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: []string{
			"http://localhost:19200",
		},
	})
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}

	// インデックスが存在するか確認
	existsReq := esapi.IndicesExistsRequest{
		Index: []string{"energies"},
	}
	existsRes, err := existsReq.Do(context.Background(), es)
	if err != nil {
		log.Fatalf("Error checking if index exists: %s", err)
	}

	// インデックスが存在しない場合は作成
	if existsRes.StatusCode == 404 {
		// energy_index.jsonからマッピング設定を読み込む
		indexFile, err := os.Open("batch/energy_index.json")
		if err != nil {
			log.Fatalf("Error opening energy_index.json: %s", err)
		}
		defer indexFile.Close()

		indexBytes, err := ioutil.ReadAll(indexFile)
		if err != nil {
			log.Fatalf("Error reading energy_index.json: %s", err)
		}

		// PUTコマンドと空行を取り除く
		indexJson := strings.Join(strings.Split(string(indexBytes), "\n")[1:], "\n")

		// インデックス作成
		createReq := esapi.IndicesCreateRequest{
			Index: "energies",
			Body:  strings.NewReader(indexJson),
		}
		createRes, err := createReq.Do(context.Background(), es)
		if err != nil {
			log.Fatalf("Error creating index: %s", err)
		}
		if createRes.IsError() {
			log.Fatalf("Error creating index: %s", createRes.String())
		}
		log.Printf("Index created successfully")
	}

	rows, err := db.Query("SELECT id, name, image_url, description, regulation, expansion FROM energies")
	if err != nil {
		log.Fatalf("Error querying database: %s", err)
	}
	defer rows.Close()

	var buf bytes.Buffer
	for rows.Next() {
		var energy Energy
		if err := rows.Scan(
			&energy.ID, &energy.Name, &energy.ImageURL, &energy.Description,
			&energy.Regulation, &energy.Expansion); err != nil {
			log.Fatalf("Error scanning row: %s", err)
		}

		meta := []byte(fmt.Sprintf(`{ "index" : { "_index" : "energies", "_id" : "%d" } }%s`, energy.ID, "\n"))
		data, err := json.Marshal(energy)
		if err != nil {
			log.Fatalf("Error marshaling energy to JSON: %s", err)
		}

		data = append(data, "\n"...)
		buf.Grow(len(meta) + len(data))
		buf.Write(meta)
		buf.Write(data)
	}

	// バルクインデックス処理
	req := esapi.BulkRequest{
		Body:    strings.NewReader(buf.String()),
		Refresh: "true",
	}

	res, err := req.Do(context.Background(), es)
	if err != nil {
		log.Fatalf("Error getting response: %s", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		log.Printf("Error indexing documents: %s", res.String())
	} else {
		log.Printf("Documents indexed successfully")
	}

	if err := rows.Err(); err != nil {
		log.Fatalf("Error with rows: %s", err)
	}
}
