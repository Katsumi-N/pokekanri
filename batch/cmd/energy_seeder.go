package cmd

import (
	"encoding/csv"
	"fmt"
	"os"
	"strings"
)

func EnergySeeder() {
	file, err := os.Open("energy_card.csv")
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

	sqlFile, err := os.Create("../sql/07_energy.sql")
	if err != nil {
		fmt.Println("Error creating SQL file:", err)
		return
	}
	defer sqlFile.Close()

	insertStmt := "INSERT INTO energies (id, name, image_url, description) VALUES "
	values := []string{}
	for i, record := range records {
		// ヘッダー行をスキップ
		if i == 0 {
			continue
		}

		id := record[0]
		name := record[1]
		imageUrl := extractFileName(record[2])
		description := record[3]

		value := fmt.Sprintf("('%s', '%s', '%s', '%s')", escapeString(id), escapeString(name), escapeString(imageUrl), escapeString(description))
		values = append(values, value)
	}

	insertStmt += strings.Join(values, ", ") + ";"

	_, err = sqlFile.WriteString(insertStmt)
	if err != nil {
		fmt.Println("Error writing to SQL file:", err)
		return
	}
}
