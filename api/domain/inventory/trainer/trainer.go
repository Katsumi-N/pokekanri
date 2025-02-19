package trainer

import "errors"

type Trainer struct {
	id          int
	name        string
	trainerType string
	description string
	imageUrl    string
}

const (
	Supporter    = "サポート"
	Stadium      = "スタジアム"
	Item         = "グッズ"
	PokemonsItem = "ポケモンのどうぐ"
)

func NewTrainer(id int, name string, trainerType string, description string, imageUrl string) (*Trainer, error) {
	if !isValidTrainerType(trainerType) {
		return nil, errors.New("Trainer type must be supporter, stadium or item")
	}

	return &Trainer{
		id:          id,
		name:        name,
		trainerType: trainerType,
		description: description,
		imageUrl:    imageUrl,
	}, nil
}

func isValidTrainerType(trainerType string) bool {
	if trainerType != Supporter && trainerType != Stadium && trainerType != Item && trainerType != PokemonsItem {
		return false
	}
	return true
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
