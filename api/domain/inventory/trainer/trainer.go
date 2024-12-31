package trainer

import "errors"

type Trainer struct {
	id          string
	name        string
	trainerType string
	description string
}

const (
	Supporter    = "サポート"
	Stadium      = "スタジアム"
	Item         = "グッズ"
	PokemonsItem = "ポケモンのどうぐ"
)

func NewTrainer(id string, name string, trainerType string, description string) (*Trainer, error) {
	if !isValidTrainerType(trainerType) {
		return nil, errors.New("Trainer type must be supporter, stadium or item")
	}

	return &Trainer{
		id:          id,
		name:        name,
		trainerType: trainerType,
		description: description,
	}, nil
}

func isValidTrainerType(trainerType string) bool {
	if trainerType != Supporter && trainerType != Stadium && trainerType != Item && trainerType != PokemonsItem {
		return false
	}
	return true
}
