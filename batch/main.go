package main

import (
	"batch/cmd"
	"fmt"
	"os"
	"strconv"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Expected 'insert' or other commands")
		return
	}

	switch os.Args[1] {
	case "scraping":
		startId, _ := strconv.Atoi(os.Args[2])
		endId, _ := strconv.Atoi(os.Args[3])
		cmd.ScrapingCardInfo(startId, endId)
	case "make-trainer-seeder":
		cmd.TrainerSeeder()
	case "make-pokemon-seeder":
		cmd.PokemonSeeder()
	case "make-pokemon-attack-seeder":
		cmd.PokemonAttackSeeder()
	case "make-energy-seeder":
		cmd.EnergySeeder()
	case "feed-pokemon":
		cmd.FeedPokemon()
	case "feed-trainer":
		cmd.FeedTrainer()
	case "download-image-from-pokemon":
		cmd.DownloadImageFromPokemon(os.Args[2])
	case "download-image-from-trainer":
		cmd.DownloadImageFromTrainers(os.Args[2])
	default:
		fmt.Println("Unknown command")
	}
}
