package cmd

import (
	"database/sql"
	"fmt"
	"log"
	"path/filepath"

	_ "github.com/go-sql-driver/mysql"
)

func DownloadImageFromEnergies(downloadPath string) {
	dsn := "root:pass@tcp(localhost:13306)/pokekanridb"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening database: %s", err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, name, image_url, expansion FROM energies")
	if err != nil {
		log.Fatalf("Error querying database: %s", err)
	}
	defer rows.Close()

	for rows.Next() {
		var energy Energy
		if err := rows.Scan(&energy.ID, &energy.Name, &energy.ImageURL, &energy.Expansion); err != nil {
			log.Fatalf("Error scanning row: %s", err)
		}

		fileName := extractFileName(energy.ImageURL)
		imageUrl := fmt.Sprintf("https://www.pokemon-card.com/assets/images/card_images/large/%s/%s", energy.Expansion, energy.ImageURL)
		if err := downloadImage(imageUrl, filepath.Join(downloadPath, fileName)); err != nil {
			log.Printf("Error downloading image for %s: %s", energy.Name, err)
		} else {
			log.Printf("Downloaded image for %s", energy.Name)
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatalf("Error with rows: %s", err)
	}
}
