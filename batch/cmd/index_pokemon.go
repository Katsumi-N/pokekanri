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

type Pokemon struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	EnergyType  string `json:"energy_type"`
	ImageURL    string `json:"image_url"`
	HP          int64  `json:"hp"`
	Description string `json:"description"`
}

func FeedPokemon() {
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

	rows, err := db.Query("SELECT id, name, energy_type, image_url, hp, description FROM pokemons")
	if err != nil {
		log.Fatalf("Error querying database: %s", err)
	}
	defer rows.Close()

	var buf bytes.Buffer
	for rows.Next() {
		var pokemon Pokemon
		if err := rows.Scan(&pokemon.ID, &pokemon.Name, &pokemon.EnergyType, &pokemon.ImageURL, &pokemon.HP, &pokemon.Description); err != nil {
			log.Fatalf("Error scanning row: %s", err)
		}

		meta := []byte(fmt.Sprintf(`{ "index" : { "_index" : "pokemon", "_id" : "%d" } }%s`, pokemon.ID, "\n"))
		data, err := json.Marshal(pokemon)
		if err != nil {
			log.Fatalf("Error marshaling pokemon to JSON: %s", err)
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
