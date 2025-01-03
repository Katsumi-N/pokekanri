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

	insertStmt := "INSERT INTO trainers (name, trainer_type, image_url, description) VALUES "
	values := []string{}
	for i, record := range records {
		// ヘッダー行をスキップ
		if i == 0 {
			continue
		}

		imageUrl := extractFileName(record[1])
		name := record[2]
		trainerType := record[3]
		description := record[4]

		value := fmt.Sprintf("('%s', '%s', '%s', '%s')", escapeString(name), escapeString(trainerType), escapeString(imageUrl), escapeString(description))
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
