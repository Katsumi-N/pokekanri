package cmd

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
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

	rows, err := db.Query("SELECT id, name, trainer_type, image_url, description FROM trainers")
	if err != nil {
		log.Fatalf("Error querying database: %s", err)
	}
	defer rows.Close()

	var buf bytes.Buffer
	for rows.Next() {
		var trainer Trainer
		if err := rows.Scan(&trainer.ID, &trainer.Name, &trainer.TrainerType, &trainer.ImageURL, &trainer.Description); err != nil {
			log.Fatalf("Error scanning row: %s", err)
		}

		meta := []byte(fmt.Sprintf(`{ "index" : { "_index" : "trainer", "_id" : "%d" } }%s`, trainer.ID, "\n"))
		data, err := json.Marshal(trainer)
		if err != nil {
			log.Fatalf("Error marshaling trainer to JSON: %s", err)
		}

		data = append(data, "\n"...)
		buf.Grow(len(meta) + len(data))
		buf.Write(meta)
		buf.Write(data)
	}

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
