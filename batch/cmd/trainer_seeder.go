package cmd

import (
	"encoding/csv"
	"fmt"
	"os"
	"strings"
)

func TrainerSeeder() {
	file, err := os.Open("trainer_card.csv")
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

	sqlFile, err := os.Create("../sql/03_trainer.sql")
	if err != nil {
		fmt.Println("Error creating SQL file:", err)
		return
	}
	defer sqlFile.Close()

	insertStmt := "INSERT INTO trainers (id, name, trainer_type, image_url, description, regulation, expansion) VALUES "
	values := []string{}
	for i, record := range records {
		// ヘッダー行をスキップ
		if i == 0 {
			continue
		}

		id := record[0]
		name := record[1]
		trainerType := record[2]
		imageUrl := extractFileName(record[3])
		description := record[4]
		regulation := record[5]
		expansion := record[6]

		value := fmt.Sprintf("('%s', '%s', '%s', '%s', '%s', '%s', '%s')", escapeString(id), escapeString(name), escapeString(trainerType), escapeString(imageUrl), escapeString(description), escapeString(regulation), escapeString(expansion))
		values = append(values, value)
	}

	insertStmt += strings.Join(values, ", ") + ";"

	_, err = sqlFile.WriteString(insertStmt)
	if err != nil {
		fmt.Println("Error writing to SQL file:", err)
		return
	}
}

// SQLインジェクションを防ぐために文字列をエスケープする関数
func escapeString(str string) string {
	return strings.ReplaceAll(str, "'", "''")
}
