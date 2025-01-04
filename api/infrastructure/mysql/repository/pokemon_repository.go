package repository

import (
	"api/domain/inventory/pokemon"
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
		CardID:     int64(pokemon.Id()),
		CardTypeID: 1,
		Quantity:   int32(quantity),
	}); err != nil {
		return err
	}
	return nil
}

func (r *pokemonRepository) FindById(ctx context.Context, pokemonId int) (*pokemon.Pokemon, error) {
	query := db.GetQuery(ctx)

	p, err := query.PokemonFindById(ctx, int64(pokemonId))
	if err != nil {
		return nil, err
	}

	pd, err := pokemon.NewPokemon(
		int(p.ID),
		p.Name,
		p.EnergyType,
		int(p.Hp),
		p.Description,
	)
	if err != nil {
		return nil, err
	}

	return pd, nil
}
