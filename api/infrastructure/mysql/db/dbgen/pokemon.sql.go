// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: pokemon.sql

package dbgen

import (
	"context"
)

const pokemonFindById = `-- name: PokemonFindById :one
SELECT id, name, energy_type, image_url, hp, description, created_at, updated_at FROM pokemons
WHERE id = ? LIMIT 1
`

func (q *Queries) PokemonFindById(ctx context.Context, id int64) (Pokemon, error) {
	row := q.db.QueryRowContext(ctx, pokemonFindById, id)
	var i Pokemon
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.EnergyType,
		&i.ImageUrl,
		&i.Hp,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}