// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0
// source: pokemon.sql

package dbgen

import (
	"context"
)

const pokemonAttackFindByPokemonId = `-- name: PokemonAttackFindByPokemonId :many
SELECT id, pokemon_id, name, required_energy, damage, description, created_at, updated_at FROM pokemon_attacks
WHERE pokemon_id = ?
`

func (q *Queries) PokemonAttackFindByPokemonId(ctx context.Context, pokemonID int64) ([]PokemonAttack, error) {
	rows, err := q.db.QueryContext(ctx, pokemonAttackFindByPokemonId, pokemonID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []PokemonAttack{}
	for rows.Next() {
		var i PokemonAttack
		if err := rows.Scan(
			&i.ID,
			&i.PokemonID,
			&i.Name,
			&i.RequiredEnergy,
			&i.Damage,
			&i.Description,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const pokemonFindById = `-- name: PokemonFindById :one
SELECT id, name, energy_type, image_url, hp, ability, ability_description, regulation, expansion, created_at, updated_at FROM pokemons
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
		&i.Ability,
		&i.AbilityDescription,
		&i.Regulation,
		&i.Expansion,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
