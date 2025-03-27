package deck

import (
	"api/domain"
	"fmt"
	"strings"
)

type Deck struct {
	id          int
	userId      string
	name        string
	description string
	mainCard    domain.Card
	subCard     domain.Card
	cards       []DeckCard
}

type DeckCard struct {
	card      domain.Card
	quantity  int
	isAceSpec bool // エーススペックフラグを追加
}

type DeckValidationError struct {
	Message string
}

func NewDeck(id int, userId string, name string, description string, mainCard domain.Card, subCard domain.Card, cards []DeckCard) (*Deck, []error) {

	deck := &Deck{
		id:          id,
		userId:      userId,
		name:        name,
		description: description,
		mainCard:    mainCard,
		subCard:     subCard,
		cards:       cards,
	}

	errors := deck.Validate()
	if len(errors) > 0 {
		return nil, errors
	}

	return deck, nil
}

func NewDeckCard(card domain.Card, quantity int) *DeckCard {
	return &DeckCard{
		card:      card,
		quantity:  quantity,
		isAceSpec: card.IsAceSpec(), // カードのIsAceSpec()メソッドを使用
	}
}

func (d *Deck) Validate() []error {
	var errors []error

	if d.name == "" {
		errors = append(errors, DeckValidationError{
			Message: "デッキ名 は必須です",
		})
	}

	if d.userId == "" {
		errors = append(errors, DeckValidationError{
			Message: "ユーザーID は必須です",
		})
	}

	totalQuantity := 0
	for _, card := range d.cards {
		totalQuantity += card.quantity
	}
	if totalQuantity != 60 {
		errors = append(errors, DeckValidationError{
			Message: "カードの合計数は60枚です",
		})
	}

	cardCounts := make(map[string]int)
	for _, deckCard := range d.cards {
		c := deckCard.card
		if c.GetCardType() == int(domain.Energy) && strings.Contains(c.GetName(), "基本") {
			continue
		}
		cardCounts[c.GetName()] += deckCard.quantity
		// エーススペックは1枚のみ
		if deckCard.IsAceSpec() {
			if cardCounts[c.GetName()] > 1 {
				errors = append(errors, DeckValidationError{
					Message: fmt.Sprintf("エーススペック: %s が2枚以上登録されています", c.GetName()),
				})
			}
		}
		// 基本エネルギー以外は４枚まで
		if cardCounts[c.GetName()] > 4 {
			errors = append(errors, DeckValidationError{
				Message: fmt.Sprintf("%s が5枚以上登録されています", c.GetName()),
			})
		}
	}

	return errors
}

func (e DeckValidationError) Error() string {
	return e.Message
}

func (d *Deck) GetMainCard() domain.Card {
	return d.mainCard
}

func (d *Deck) GetSubCard() domain.Card {
	return d.subCard
}

func (d *Deck) GetCards() []DeckCard {
	return d.cards
}

func (d *Deck) GetId() int {
	return d.id
}

func (d *Deck) GetName() string {
	return d.name
}

func (d *Deck) GetDescription() string {
	return d.description
}

func (d *Deck) GetUserID() string {
	return d.userId
}

func (d *DeckCard) GetCard() domain.Card {
	return d.card
}

func (d *DeckCard) GetQuantity() int {
	return d.quantity
}

// IsAceSpecメソッドを追加
func (d *DeckCard) IsAceSpec() bool {
	return d.isAceSpec
}
