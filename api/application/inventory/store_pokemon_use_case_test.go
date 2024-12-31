package inventory

import (
	"context"
	"errors"
	"testing"
	"time"

	"go.uber.org/mock/gomock"

	"api/domain/inventory/pokemon"
	pokemonDomain "api/domain/inventory/pokemon"
)

func TestStorePokemonUseCase_Save(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockPokemonRepo := pokemonDomain.NewMockPokemonRepository(ctrl)
	uc := NewStorePokemonUseCase(mockPokemonRepo)

	ctx := context.Background()
	userId := "testuser"
	now := time.Now()

	tests := map[string]struct {
		dto          StorePokemonCardUseCaseDto
		mockFindById func()
		mockSave     func()
		expectError  bool
	}{
		"valid_pokemon": {
			dto: StorePokemonCardUseCaseDto{PokemonId: "001", Quantity: 10},
			mockFindById: func() {
				mockPokemonRepo.EXPECT().FindById(ctx, "001").Return(&pokemon.Pokemon{}, nil)
			},
			mockSave: func() {
				mockPokemonRepo.EXPECT().Save(ctx, &pokemon.Pokemon{}, userId, 10, now).Return(nil)
			},
			expectError: false,
		},
		"pokemon_not_found": {
			dto: StorePokemonCardUseCaseDto{PokemonId: "002", Quantity: 5},
			mockFindById: func() {
				mockPokemonRepo.EXPECT().FindById(ctx, "002").Return(nil, nil)
			},
			mockSave:    func() {},
			expectError: true,
		},
		"find_error": {
			dto: StorePokemonCardUseCaseDto{PokemonId: "003", Quantity: 3},
			mockFindById: func() {
				mockPokemonRepo.EXPECT().FindById(ctx, "003").Return(nil, errors.New("find error"))
			},
			mockSave:    func() {},
			expectError: true,
		},
		"save_error": {
			dto: StorePokemonCardUseCaseDto{PokemonId: "004", Quantity: 7},
			mockFindById: func() {
				mockPokemonRepo.EXPECT().FindById(ctx, "004").Return(&pokemon.Pokemon{}, nil)
			},
			mockSave: func() {
				mockPokemonRepo.EXPECT().Save(ctx, &pokemon.Pokemon{}, userId, 7, now).Return(errors.New("save error"))
			},
			expectError: true,
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			tt.mockFindById()
			tt.mockSave()

			err := uc.Save(ctx, userId, tt.dto, now)
			if tt.expectError {
				if err == nil {
					t.Errorf("expected error for input %v, got nil", tt)
				}
			} else {
				if err != nil {
					t.Errorf("unexpected error for input %v: %v", tt, err)
				}
			}
		})
	}
}
