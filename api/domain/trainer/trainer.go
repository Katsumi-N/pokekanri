package trainer

import (
	"errors"

	"github.com/samber/lo"
)

type Trainer struct {
	id          int
	name        string
	trainerType string
	description string
	imageUrl    string
	regulation  string
	expansion   string
}

const (
	Supporter    = "サポート"
	Stadium      = "スタジアム"
	Item         = "グッズ"
	PokemonsItem = "ポケモンのどうぐ"
)

var validTrainerTypes = []string{Supporter, Stadium, Item, PokemonsItem}

func NewTrainer(id int, name string, trainerType string, description string, imageUrl string, regulation string, expansion string) (*Trainer, error) {
	if !isValidTrainerType(trainerType) {
		return nil, errors.New("Trainer type must be supporter, stadium or item")
	}

	return &Trainer{
		id:          id,
		name:        name,
		trainerType: trainerType,
		description: description,
		imageUrl:    imageUrl,
		regulation:  regulation,
		expansion:   expansion,
	}, nil
}

func isValidTrainerType(trainerType string) bool {
	return lo.Contains(validTrainerTypes, trainerType)
}

func (t *Trainer) GetId() int {
	return t.id
}

func (t *Trainer) GetName() string {
	return t.name
}

func (t *Trainer) GetCardTypeId() int {
	return 2
}

func (t *Trainer) GetImageUrl() string {
	return t.imageUrl
}
