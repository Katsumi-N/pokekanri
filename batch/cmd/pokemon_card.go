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

	"github.com/PuerkitoBio/goquery"
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

type PokemonAttack struct {
	Name           string
	RequiredEnergy string
	Damage         string
	Description    string
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

func ScrapingCardInfo(startPage int, endPage int) {
	cardMapType := map[string]string{
		"grass":    "草",
		"fire":     "炎",
		"water":    "水",
		"electric": "雷",
		"psychic":  "超",
		"dark":     "悪",
		"fighting": "闘",
		"steel":    "鋼",
		"dragon":   "竜",
		"none":     "無",
		"void":     "エネ0",
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

	energyFile, err := os.Create("energy_card.csv")
	if err != nil {
		log.Fatal("Cannot create file", err)
	}
	defer energyFile.Close()

	pokemonAttackFile, err := os.Create("pokemon_attack.csv")
	if err != nil {
		log.Fatal("Cannot create file", err)
	}
	defer pokemonAttackFile.Close()

	pokemonWriter := csv.NewWriter(pokemonFile)
	defer pokemonWriter.Flush()

	pokemonWriter.Write([]string{"CardId", "Name", "EnergyType", "ImageUrl", "HP", "Ability", "AbilityDescription", "Regulation", "Expansion"})

	pokemonAttackWriter := csv.NewWriter(pokemonAttackFile)
	defer pokemonAttackWriter.Flush()

	pokemonAttackWriter.Write([]string{"PokemonId", "Name", "RequiredEnergy", "Damage", "Description"})

	trainerWriter := csv.NewWriter(trainerFile)
	defer trainerWriter.Flush()

	trainerWriter.Write([]string{"CardId", "Name", "TrainerType", "ImageUrl", "Description", "Regulation", "Expansion"})

	energyWriter := csv.NewWriter(energyFile)
	defer energyWriter.Flush()

	energyWriter.Write([]string{"CardId", "Name", "ImageUrl", "Description", "Regulation", "Expansion"})

	cardLists := make(map[string]CardInfo)

	c.OnHTML(".Section", func(e *colly.HTMLElement) {
		pokemonFlg := true
		cardID := extractCardId(e.Request.URL.String())
		cardHP := e.ChildText("div > div.RightBox > div > div.TopInfo.Text-fjalla > div > div.td-r > span.hp-num")
		if cardHP == "" {
			pokemonFlg = false
		}
		current_card := cardLists[cardID]

		regulation := e.ChildAttr("div > div.LeftBox > div.subtext.Text-fjalla > img", "alt")
		if pokemonFlg {
			classAttr := e.ChildAttr("div > div.RightBox > div > div.TopInfo.Text-fjalla > div > div.td-r > span[class*='icon-']", "class")
			var cardTypeClass string
			for _, class := range strings.Split(classAttr, " ") {
				if strings.HasPrefix(class, "icon-") {
					cardTypeClass = cardMapType[strings.TrimPrefix(class, "icon-")]
					break
				}
			}
			tokusei := e.ChildText("div > div.RightBox > div > h2:nth-child(2)")
			var abilityName, abilityDescription string
			if tokusei == "特性" {
				abilityName = e.ChildText("div > div.RightBox > div > h4:nth-child(3)")
				abilityDescription = e.ChildText("div > div.RightBox > div > p:nth-child(4)")
			}
			// Attackを2つまで取得
			var attacks []PokemonAttack
			e.ForEach("div.RightBox-inner h2", func(_ int, el *colly.HTMLElement) {
				if el.Text == "ワザ" {
					el.DOM.NextAllFiltered("h4").Each(func(_ int, h4 *goquery.Selection) {
						moveName := h4.Text()
						// moveNameから数字を削除, スペースを削除
						// 90＋ や 10× も直す
						moveName = strings.TrimSpace(strings.TrimRight(moveName, "0123456789"))
						moveName = strings.Join(strings.Fields(regexp.MustCompile(`[0-9]+[＋×]`).ReplaceAllString(moveName, "")), "")

						if moveName == "" {
							return
						}
						requiredEnergy := ""
						h4.Find("span[class*='icon-']").Each(func(_ int, span *goquery.Selection) {
							class, _ := span.Attr("class")
							for _, className := range strings.Split(class, " ") {
								if strings.HasPrefix(className, "icon-") {
									requiredEnergy += cardMapType[strings.TrimPrefix(className, "icon-")]
								}
							}
						})
						damage := h4.Find("span.f_right.Text-fjalla").Text()
						moveEffect := h4.Next().Text()
						fmt.Println(moveName, requiredEnergy, damage, moveEffect)
						attacks = append(attacks, PokemonAttack{
							Name:           moveName,
							RequiredEnergy: requiredEnergy,
							Damage:         damage,
							Description:    moveEffect,
						})
					})
				}
			})

			// TODO: expansionの取得
			pokemonWriter.Write([]string{cardID, current_card.Name, cardTypeClass, current_card.ImageURL, cardHP, abilityName, abilityDescription, regulation, ""})
			for _, attack := range attacks {
				pokemonAttackWriter.Write([]string{cardID, attack.Name, attack.RequiredEnergy, attack.Damage, attack.Description})
			}
		} else {
			classAttr := e.ChildText(" div > div.RightBox > div > h2")
			if classAttr == "基本エネルギー" || classAttr == "特殊エネルギー" {
				description := strings.Join(strings.Fields(e.ChildText("div > div.RightBox > div > p")), "")
				energyWriter.Write([]string{cardID, current_card.Name, current_card.ImageURL, description, regulation, ""})
			} else {
				cardDescription := strings.Join(strings.Fields(e.ChildText("div > div.RightBox > div > p:nth-child(3)")), "")
				trainerWriter.Write([]string{cardID, current_card.Name, classAttr, current_card.ImageURL, cardDescription, regulation, ""})
			}
		}
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL.String())
	})

	c.OnError(func(r *colly.Response, err error) {
		fmt.Println("Request URL:", r.Request.URL, "failed with response:", r, "\nError:", err)
	})

	// Call pokemonCardSearch API
	for page := startPage; page <= endPage; page++ {
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
			time.Sleep(300 * time.Millisecond)
		}
	}

}
