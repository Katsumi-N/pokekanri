package pokemon

import "errors"

type Pokemon struct {
	id          string
	name        string
	energyType  string
	hp          int
	description string
}

const (
	Fire      = "炎"
	Water     = "水"
	Electric  = "雷"
	Fight     = "闘"
	Psychic   = "超"
	Grass     = "草"
	Steel     = "鋼"
	Dark      = "悪"
	Colorless = "無色"
	Dragon    = "ドラゴン"
)

var validEnergyTypes = []string{Fire, Water, Electric, Fight, Psychic, Grass, Steel, Dark, Colorless, Dragon}

func NewPokemon(id string, name string, energyType string, hp int, description string) (*Pokemon, error) {
	if !isValidEnergyType(energyType) {
		return nil, errors.New("energy type must be valid type")
	}

	if hp < 0 {
		return nil, errors.New("HP must be greater than or equal to 0")
	}

	return &Pokemon{
		id:          id,
		name:        name,
		energyType:  energyType,
		hp:          hp,
		description: description,
	}, nil
}

func isValidEnergyType(energyType string) bool {
	for _, validType := range validEnergyTypes {
		if energyType == validType {
			return true
		}
	}
	return false
}
