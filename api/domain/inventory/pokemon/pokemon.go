package pokemon

import "errors"

type Pokemon struct {
	id          int
	name        string
	energyType  string
	hp          int
	description string
	imageUrl    string
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

func NewPokemon(id int, name string, energyType string, hp int, description string, imageUrl string) (*Pokemon, error) {
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
		imageUrl:    imageUrl,
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

func (p *Pokemon) GetId() int {
	return p.id
}

func (p *Pokemon) GetName() string {
	return p.name
}

func (p *Pokemon) GetCardTypeId() int {
	return 1
}

func (p *Pokemon) GetImageUrl() string {
	return p.imageUrl
}
