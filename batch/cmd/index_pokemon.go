package cmd

import (
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

	for rows.Next() {
		var pokemon Pokemon
		if err := rows.Scan(&pokemon.ID, &pokemon.Name, &pokemon.EnergyType, &pokemon.ImageURL, &pokemon.HP, &pokemon.Description); err != nil {
			log.Fatalf("Error scanning row: %s", err)
		}

		pokemonJSON, err := json.Marshal(pokemon)
		if err != nil {
			log.Fatalf("Error marshaling pokemon to JSON: %s", err)
		}

		req := esapi.IndexRequest{
			Index:      "pokemon",
			DocumentID: fmt.Sprintf("%d", pokemon.ID),
			Body:       strings.NewReader(string(pokemonJSON)),
			Refresh:    "true",
		}

		res, err := req.Do(context.Background(), es)
		if err != nil {
			log.Fatalf("Error getting response: %s", err)
		}
		defer res.Body.Close()

		if res.IsError() {
			log.Printf("[%s] Error indexing document ID=%d", res.Status(), pokemon.ID)
		} else {
			log.Printf("[%s] Document ID=%d indexed successfully", res.Status(), pokemon.ID)
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatalf("Error with rows: %s", err)
	}
}
