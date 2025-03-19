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

type PokemonAttackIndex struct {
	ID             int64   `json:"id"`
	Name           string  `json:"name"`
	RequiredEnergy string  `json:"required_energy"`
	Damage         *string `json:"damage"`
	Description    *string `json:"description"`
}

type Pokemon struct {
	ID                 int64                `json:"id"`
	Name               string               `json:"name"`
	EnergyType         string               `json:"energy_type"`
	ImageURL           string               `json:"image_url"`
	HP                 int64                `json:"hp"`
	Ability            *string              `json:"ability"`
	AbilityDescription *string              `json:"ability_description"`
	Regulation         string               `json:"regulation"`
	Expansion          string               `json:"expansion"`
	Attacks            []PokemonAttackIndex `json:"attacks"`
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

	// インデックスが存在するか確認
	existsReq := esapi.IndicesExistsRequest{
		Index: []string{"pokemons"},
	}
	existsRes, err := existsReq.Do(context.Background(), es)
	if err != nil {
		log.Fatalf("Error checking if index exists: %s", err)
	}

	// インデックスが存在しない場合は作成
	if existsRes.StatusCode == 404 {
		// pokemon_index.jsonからマッピング設定を読み込む
		indexFile, err := os.Open("../batch/pokemon_index.json")
		if err != nil {
			log.Fatalf("Error opening pokemon_index.json: %s", err)
		}
		defer indexFile.Close()

		indexBytes, err := ioutil.ReadAll(indexFile)
		if err != nil {
			log.Fatalf("Error reading pokemon_index.json: %s", err)
		}

		indexJson := strings.Join(strings.Split(string(indexBytes), "\n"), "\n")

		// インデックス作成
		createReq := esapi.IndicesCreateRequest{
			Index: "pokemons",
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

	// ポケモンデータとアタックデータを一緒に取得
	rows, err := db.Query(`
		SELECT 
			p.id, p.name, p.energy_type, p.image_url, p.hp, 
			p.ability, p.ability_description, p.regulation, p.expansion
		FROM pokemons p
	`)
	if err != nil {
		log.Fatalf("Error querying database: %s", err)
	}
	defer rows.Close()

	var buf bytes.Buffer
	for rows.Next() {
		var pokemon Pokemon
		if err := rows.Scan(
			&pokemon.ID, &pokemon.Name, &pokemon.EnergyType, &pokemon.ImageURL, &pokemon.HP,
			&pokemon.Ability, &pokemon.AbilityDescription, &pokemon.Regulation, &pokemon.Expansion,
		); err != nil {
			log.Fatalf("Error scanning pokemon row: %s", err)
		}

		// このポケモンのアタックを取得
		attackRows, err := db.Query(`
			SELECT id, name, required_energy, damage, description
			FROM pokemon_attacks
			WHERE pokemon_id = ?
		`, pokemon.ID)
		if err != nil {
			log.Fatalf("Error querying pokemon attacks: %s", err)
		}

		// アタックをポケモンに追加
		pokemon.Attacks = []PokemonAttackIndex{}
		for attackRows.Next() {
			var attack PokemonAttackIndex
			if err := attackRows.Scan(
				&attack.ID, &attack.Name, &attack.RequiredEnergy, &attack.Damage, &attack.Description,
			); err != nil {
				log.Fatalf("Error scanning attack row: %s", err)
			}
			pokemon.Attacks = append(pokemon.Attacks, attack)
		}
		attackRows.Close()

		meta := []byte(fmt.Sprintf(`{ "index" : { "_index" : "pokemons", "_id" : "%d" } }%s`, pokemon.ID, "\n"))
		data, err := json.Marshal(pokemon)
		if err != nil {
			log.Fatalf("Error marshaling pokemon to JSON: %s", err)
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
