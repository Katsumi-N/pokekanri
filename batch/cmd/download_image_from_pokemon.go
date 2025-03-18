package cmd

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

func DownloadImageFromPokemon(downloadPath string) {
	dsn := "root:pass@tcp(localhost:13306)/pokekanridb"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening database: %s", err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, name, image_url, regulation FROM pokemons")
	if err != nil {
		log.Fatalf("Error querying database: %s", err)
	}
	defer rows.Close()

	for rows.Next() {
		var pokemon Pokemon
		if err := rows.Scan(&pokemon.ID, &pokemon.Name, &pokemon.ImageURL, &pokemon.Regulation); err != nil {
			log.Fatalf("Error scanning row: %s", err)
		}

		fileName := extractFileName(pokemon.ImageURL)
		imageUrl := fmt.Sprintf("https://www.pokemon-card.com/assets/images/card_images/large/%s/%s", pokemon.Regulation, pokemon.ImageURL)
		if err := downloadImage(imageUrl, filepath.Join(downloadPath, fileName)); err != nil {
			log.Printf("Error downloading image for %s: %s", pokemon.Name, err)
		} else {
			log.Printf("Downloaded image for %s", pokemon.Name)
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatalf("Error with rows: %s", err)
	}
}

func downloadImage(url, filepath string) error {
	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("error downloading image: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	out, err := os.Create(filepath)
	if err != nil {
		return fmt.Errorf("error creating file: %w", err)
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return fmt.Errorf("error saving image: %w", err)
	}

	return nil
}

func extractFileName(url string) string {
	parts := strings.Split(url, "/")
	return parts[len(parts)-1]
}
