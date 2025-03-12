package cmd

import (
	"encoding/csv"
	"fmt"
	"os"
	"strings"
)

func PokemonAttackSeeder() {
	file, err := os.Open("pokemon_attack.csv")
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

	sqlFile, err := os.Create("../sql/06_pokemon_attack.sql")
	if err != nil {
		fmt.Println("Error creating SQL file:", err)
		return
	}
	defer sqlFile.Close()

	insertStmt := "INSERT INTO pokemon_attacks (pokemon_id, name, required_energy, damage, description) VALUES "
	values := []string{}
	for i, record := range records {
		// ヘッダー行をスキップ
		if i == 0 {
			continue
		}

		pokemonId := record[0]
		name := record[1]
		requiredEnergy := record[2]
		damage := record[3]
		description := record[4]

		value := fmt.Sprintf("('%s', '%s', '%s', '%s', '%s')", escapeString(pokemonId), escapeString(name), escapeString(requiredEnergy), escapeString(damage), escapeString(description))
		values = append(values, value)
	}

	insertStmt += strings.Join(values, ", ") + ";"

	_, err = sqlFile.WriteString(insertStmt)
	if err != nil {
		fmt.Println("Error writing to SQL file:", err)
		return
	}
}
