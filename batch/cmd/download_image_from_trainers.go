package cmd

import (
	"database/sql"
	"log"
	"path/filepath"

	_ "github.com/go-sql-driver/mysql"
)

func DownloadImageFromTrainers(downloadPath string) {
	dsn := "root:pass@tcp(localhost:13306)/pokekanridb"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening database: %s", err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, name, image_url FROM trainers")
	if err != nil {
		log.Fatalf("Error querying database: %s", err)
	}
	defer rows.Close()

	for rows.Next() {
		var trainer Trainer
		if err := rows.Scan(&trainer.ID, &trainer.Name, &trainer.ImageURL); err != nil {
			log.Fatalf("Error scanning row: %s", err)
		}

		fileName := extractFileName(trainer.ImageURL)
		if err := downloadImage(trainer.ImageURL, filepath.Join(downloadPath, fileName)); err != nil {
			log.Printf("Error downloading image for %s: %s", trainer.Name, err)
		} else {
			log.Printf("Downloaded image for %s", trainer.Name)
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatalf("Error with rows: %s", err)
	}
}
