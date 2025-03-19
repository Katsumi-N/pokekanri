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

type Trainer struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	TrainerType string `json:"trainer_type"`
	ImageURL    string `json:"image_url"`
	Description string `json:"description"`
	Regulation  string `json:"regulation"`
	Expansion   string `json:"expansion"`
}

func FeedTrainer() {
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
		Index: []string{"trainers"},
	}
	existsRes, err := existsReq.Do(context.Background(), es)
	if err != nil {
		log.Fatalf("Error checking if index exists: %s", err)
	}

	// インデックスが存在しない場合は作成
	if existsRes.StatusCode == 404 {
		// trainer_index.jsonからマッピング設定を読み込む
		indexFile, err := os.Open("../batch/trainer_index.json")
		if err != nil {
			log.Fatalf("Error opening trainer_index.json: %s", err)
		}
		defer indexFile.Close()

		indexBytes, err := ioutil.ReadAll(indexFile)
		if err != nil {
			log.Fatalf("Error reading trainer_index.json: %s", err)
		}

		indexJson := strings.Join(strings.Split(string(indexBytes), "\n"), "\n")

		// インデックス作成
		createReq := esapi.IndicesCreateRequest{
			Index: "trainers",
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

	rows, err := db.Query("SELECT id, name, trainer_type, image_url, description, regulation, expansion FROM trainers")
	if err != nil {
		log.Fatalf("Error querying database: %s", err)
	}
	defer rows.Close()

	var buf bytes.Buffer
	for rows.Next() {
		var trainer Trainer
		if err := rows.Scan(
			&trainer.ID, &trainer.Name, &trainer.TrainerType, &trainer.ImageURL,
			&trainer.Description, &trainer.Regulation, &trainer.Expansion,
		); err != nil {
			log.Fatalf("Error scanning row: %s", err)
		}

		meta := []byte(fmt.Sprintf(`{ "index" : { "_index" : "trainers", "_id" : "%d" } }%s`, trainer.ID, "\n"))
		data, err := json.Marshal(trainer)
		if err != nil {
			log.Fatalf("Error marshaling trainer to JSON: %s", err)
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
