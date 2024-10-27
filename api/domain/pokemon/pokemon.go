package pokemon

import "errors"

type Pokemon struct {
	id          string
	name        string
	energyType  string
	hp          int
	description string
}

func NewPokemon(id string, name string, energyType string, hp int, description string) (*Pokemon, error) {
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
