package cmd

import (
	"encoding/csv"
	"fmt"
	"os"
	"strings"
)

func PokemonSeeder() {
	file, err := os.Open("pokemon_card.csv")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.FieldsPerRecord = -1

	records, err := reader.ReadAll()
	if err != nil {
		fmt.Println("Error reading CSV:", err)
		return
	}

	sqlFile, err := os.Create("../sql/04_pokemon.sql")
	if err != nil {
		fmt.Println("Error creating SQL file:", err)
		return
	}
	defer sqlFile.Close()

	insertStmt := "INSERT INTO pokemons (name, energy_type, image_url, hp, description) VALUES "
	values := []string{}
	for i, record := range records {
		// ヘッダー行をスキップ
		if i == 0 {
			continue
		}

		imageUrl := record[1]
		name := record[2]
		energyType := record[3]
		hp := record[4]
		description := record[5]

		value := fmt.Sprintf("('%s', '%s', '%s', %s, '%s')", escapeString(name), escapeString(energyType), escapeString(imageUrl), hp, escapeString(description))
		values = append(values, value)
	}

	insertStmt += strings.Join(values, ", ") + ";"

	_, err = sqlFile.WriteString(insertStmt)
	if err != nil {
		fmt.Println("Error writing to SQL file:", err)
		return
	}
}
