package pokemon

import "context"

type SearchPokemonList struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	EnergyType string `json:"energy_type"`
	Hp         int    `json:"hp"`
}

type PokemonQueryService interface {
	SearchPokemonList(ctx context.Context, q string) ([]*SearchPokemonList, error)
}
