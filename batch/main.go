package main

import (
	"batch/cmd"
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Expected 'insert' or other commands")
		return
	}

	switch os.Args[1] {
	case "scraping":
		cmd.ScrapingCardInfo()
	case "make-trainer-seeder":
		cmd.TrainerSeeder()
	case "make-pokemon-seeder":
		cmd.PokemonSeeder()
	default:
		fmt.Println("Unknown command")
	}
}
