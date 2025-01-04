package repository

import (
	"context"
	"testing"

	"api/domain/inventory/pokemon"

	"github.com/stretchr/testify/assert"
)

func TestPokemonRepository_FindById(t *testing.T) {
	// テストデータの準備
	setupFixtures(t)

	repo := NewPokemonRepository()
	pika, _ := pokemon.NewPokemon(1, "ピカチュウex", "雷", 230, "テラスタル")
	tests := map[string]struct {
		pokemonId   int
		expected    *pokemon.Pokemon
		expectError bool
	}{
		"valid_pokemon": {
			pokemonId:   1,
			expected:    pika,
			expectError: false,
		},
		"invalid_pokemon": {
			pokemonId:   999,
			expected:    nil,
			expectError: true,
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			ctx := context.Background()
			result, err := repo.FindById(ctx, tt.pokemonId)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
		})
	}
}
