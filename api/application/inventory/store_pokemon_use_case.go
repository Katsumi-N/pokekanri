package inventory

import (
	pokemonDomain "api/domain/inventory/pokemon"
	"context"
	"fmt"
	"time"
)

type StorePokemonUseCase struct {
	pokemonRepo pokemonDomain.PokemonRepository
}

func NewStorePokemonUseCase(pokemonRepo pokemonDomain.PokemonRepository) *StorePokemonUseCase {
	return &StorePokemonUseCase{
		pokemonRepo: pokemonRepo,
	}
}

type StorePokemonCardUseCaseDto struct {
	PokemonId int
	Quantity  int
}

func (uc *StorePokemonUseCase) Save(ctx context.Context, userId string, dto StorePokemonCardUseCaseDto, now time.Time) error {
	pokemon, err := uc.getValidPokemon(ctx, dto)
	if err != nil {
		return err
	}
	return uc.pokemonRepo.Save(ctx, pokemon, userId, dto.Quantity, now)
}

func (uc *StorePokemonUseCase) getValidPokemon(ctx context.Context, dto StorePokemonCardUseCaseDto) (*pokemonDomain.Pokemon, error) {
	pokemon, err := uc.pokemonRepo.FindById(ctx, dto.PokemonId)
	if err != nil {
		return nil, err
	}

	if pokemon == nil {
		return nil, fmt.Errorf("pokemon not found")
	}

	return pokemon, nil
}
