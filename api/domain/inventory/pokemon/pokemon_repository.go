package pokemon

import (
	"context"
	"time"
)

type PokemonRepository interface {
	Save(ctx context.Context, pokemon *Pokemon, userId string, quantity int, now time.Time) error
	FindById(ctx context.Context, pokemonId int) (*Pokemon, error)
}
