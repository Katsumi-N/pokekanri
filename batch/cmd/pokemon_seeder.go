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

	insertStmt := "INSERT INTO pokemons (id, name, energy_type, image_url, hp, ability, ability_description, regulation, expansion) VALUES "
	values := []string{}
	for i, record := range records {
		// ヘッダー行をスキップ
		if i == 0 {
			continue
		}

		id := record[0]
		name := record[1]
		energyType := record[2]
		imageUrl := extractFileName(record[3])
		hp := record[4]
		ability := record[5]
		abilityDescription := record[6]
		regulation := record[7]
		expansion := record[8]

		value := fmt.Sprintf("('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')", escapeString(id), escapeString(name), escapeString(energyType), escapeString(imageUrl), hp, escapeString(ability), escapeString(abilityDescription), escapeString(regulation), escapeString(expansion))
		values = append(values, value)
	}

	insertStmt += strings.Join(values, ", ") + ";"

	_, err = sqlFile.WriteString(insertStmt)
	if err != nil {
		fmt.Println("Error writing to SQL file:", err)
		return
	}
}
