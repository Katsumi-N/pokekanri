package cmd

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gocolly/colly/v2"
	"github.com/joho/godotenv"
)

type CardSearchResponse struct {
	Result          int      `json:"result"`
	ErrMsg          string   `json:"errMsg"`
	ThisPage        int      `json:"thisPage"`
	MaxPage         int      `json:"maxPage"`
	HitCnt          int      `json:"hitCnt"`
	CardStart       int      `json:"cardStart"`
	CardEnd         int      `json:"cardEnd"`
	SearchCondition []string `json:"searchCondition"`
	Regulation      string   `json:"regulation"`
	CardList        []struct {
		CardID           string `json:"cardID"`
		CardThumbFile    string `json:"cardThumbFile"`
		CardNameAltText  string `json:"cardNameAltText"`
		CardNameViewText string `json:"cardNameViewText"`
	} `json:"cardList"`
}

type CardInfo struct {
	CardId   string
	ImageURL string
	Name     string
}

func extractCardId(url string) string {
	re := regexp.MustCompile(`/card/(\d+)/`)
	matches := re.FindStringSubmatch(url)
	if len(matches) < 2 {
		return ""
	}
	return matches[1]
}

func RequestPokemonCardSearch(page int) (*CardSearchResponse, error) {
	pokemonCardSearchApiUrl := os.Getenv("POKEMON_CARD_SEARCH_API_URL")
	if pokemonCardSearchApiUrl == "" {
		return nil, fmt.Errorf("POKEMON_CARD_SEARCH_URL is not set")
	}

	parsedURL, err := url.Parse(pokemonCardSearchApiUrl)
	if err != nil {
		return nil, err
	}

	q := parsedURL.Query()
	q.Set("regulation_sidebar_form", "XY")
	q.Set("sm_and_keyword", "true")
	q.Set("page", strconv.Itoa(page))
	parsedURL.RawQuery = q.Encode()

	resp, err := http.Get(parsedURL.String())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var cardSearchResponse CardSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&cardSearchResponse); err != nil {
		log.Fatal("Failed to decode card list", err)
	}

	return &cardSearchResponse, nil
}

func ScrapingCardInfo() {
	cardMapType := map[string]string{
		"grass":    "草",
		"fire":     "炎",
		"water":    "水",
		"electric": "電気",
		"psychic":  "超",
		"dark":     "悪",
		"fighting": "闘",
		"steel":    "鋼",
		"dragon":   "ドラゴン",
		"none":     "無色",
	}
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"),
	)

	pokemonFile, err := os.Create("pokemon_card.csv")
	if err != nil {
		log.Fatal("Cannot create file", err)
	}
	defer pokemonFile.Close()

	trainerFile, err := os.Create("trainer_card.csv")
	if err != nil {
		log.Fatal("Cannot create file", err)
	}
	defer trainerFile.Close()

	pokemonWriter := csv.NewWriter(pokemonFile)
	defer pokemonWriter.Flush()

	pokemonWriter.Write([]string{"CardId", "ImageId", "Name", "Type", "HP", "Description"})

	trainerWriter := csv.NewWriter(trainerFile)
	defer trainerWriter.Flush()

	trainerWriter.Write([]string{"CardId", "ImageId", "Name", "Type", "Description"})

	cardLists := make(map[string]CardInfo)

	c.OnHTML(".Section", func(e *colly.HTMLElement) {
		pokemonFlg := true
		cardID := extractCardId(e.Request.URL.String())
		cardHP := e.ChildText("div > div.RightBox > div > div.TopInfo.Text-fjalla > div > div.td-r > span.hp-num")
		if cardHP == "" {
			pokemonFlg = false
		}
		current_card := cardLists[cardID]

		if pokemonFlg {
			cardDescription := strings.Join(strings.Fields(e.ChildText("div > div.RightBox > div")), " ")
			classAttr := e.ChildAttr("div > div.RightBox > div > div.TopInfo.Text-fjalla > div > div.td-r > span[class*='icon-']", "class")
			var cardTypeClass string
			for _, class := range strings.Split(classAttr, " ") {
				if strings.HasPrefix(class, "icon-") {
					cardTypeClass = cardMapType[strings.TrimPrefix(class, "icon-")]
					break
				}
			}
			pokemonWriter.Write([]string{cardID, current_card.ImageURL, current_card.Name, cardTypeClass, cardHP, cardDescription})
		} else {
			cardDescription := strings.Join(strings.Fields(e.ChildText("div > div.RightBox > div")), " ")
			classAttr := e.ChildText(" div > div.RightBox > div > h2")

			trainerWriter.Write([]string{cardID, current_card.ImageURL, current_card.Name, classAttr, cardDescription})
		}
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL.String())
	})

	c.OnError(func(r *colly.Response, err error) {
		fmt.Println("Request URL:", r.Request.URL, "failed with response:", r, "\nError:", err)
	})

	// Call pokemonCardSearch API
	for page := 1; page <= 100; page++ {
		cardSearchResponse, err := RequestPokemonCardSearch(page)
		if err != nil {
			log.Fatal("Failed to fetch card list", err)
		}

		for _, card := range cardSearchResponse.CardList {
			cardInfo := CardInfo{
				CardId:   card.CardID,
				Name:     card.CardNameViewText,
				ImageURL: card.CardThumbFile,
			}
			cardLists[card.CardID] = cardInfo

			cardSearchUrlTemplate := os.Getenv("POKEMON_CARD_SEARCH_URL")
			if cardSearchUrlTemplate == "" {
				log.Fatal("POKEMON_CARD_SEARCH_URL is not set in .env file")
			}
			cardDetailURL := fmt.Sprintf(cardSearchUrlTemplate, card.CardID)
			log.Println("cardDetailURL", cardDetailURL)
			c.Visit(cardDetailURL)
			time.Sleep(500 * time.Millisecond)
		}
	}

}
