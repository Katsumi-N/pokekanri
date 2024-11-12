package pokemon

import (
	"context"
	"fmt"
)

type SearchPokemonUseCase struct {
	pokemonQueryService PokemonQueryService
}

type SearchPokemonUseCaseDto struct {
	ID         string
	Name       string
	EnergyType string
	Hp         int
	ImageURL   string
}

func (uc *SearchPokemonUseCase) SearchPokemonList(ctx context.Context, q string) ([]*SearchPokemonUseCaseDto, error) {
	searchPokemonList, err := uc.pokemonQueryService.SearchPokemonList(ctx, q)
	if err != nil {
		return nil, err
	}

	var dtoList []*SearchPokemonUseCaseDto
	for _, f := range searchPokemonList {
		dto := &SearchPokemonUseCaseDto{
			ID:         fmt.Sprintf("%v", f.ID),
			Name:       f.Name,
			EnergyType: f.EnergyType,
			Hp:         f.Hp,
			ImageURL:   f.ImageURL,
		}
		dtoList = append(dtoList, dto)
	}

	return dtoList, nil
}
