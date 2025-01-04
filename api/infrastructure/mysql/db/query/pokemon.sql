-- name: PokemonFindById :one
SELECT * FROM pokemons
WHERE id = ? LIMIT 1;
