package repository

import (
	"api/domain/pokemon"
	"api/infrastructure/mysql/db"
	"api/infrastructure/mysql/db/dbgen"
	"context"
	"time"
)

type pokemonRepository struct{}

func NewPokemonRepository() *pokemonRepository {
	return &pokemonRepository{}
}

func (r *pokemonRepository) Save(ctx context.Context, pokemon *pokemon.Pokemon, userId string, quantity int, now time.Time) error {
	query := db.GetQuery(ctx)

	if err := query.InsertInventory(ctx, dbgen.InsertInventoryParams{
		UserID:     userId,
		CardID:     int64(pokemon.GetId()),
		CardTypeID: 1,
		Quantity:   int32(quantity),
	}); err != nil {
		return err
	}
	return nil
}
