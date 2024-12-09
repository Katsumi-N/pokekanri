package card

import (
	"api/application/pokemon"
	"api/application/trainer"
	"context"
	"fmt"
)

type SearchPokemonAndTrainerUseCase struct {
	pokemonQueryService pokemon.PokemonQueryService
	trainerQueryService trainer.TrainerQueryService
}

func NewSearchPokemonAndTrainerUseCase(pokemonQueryService pokemon.PokemonQueryService, trainerQueryService trainer.TrainerQueryService) *SearchPokemonAndTrainerUseCase {
	return &SearchPokemonAndTrainerUseCase{
		pokemonQueryService: pokemonQueryService,
		trainerQueryService: trainerQueryService,
	}
}

type SearchPokemonAndTrainerUseCaseDto struct {
	Pokemons []*pokemon.SearchPokemonUseCaseDto `json:"pokemons"`
	Trainers []*trainer.SearchTrainerUseCaseDto `json:"trainers"`
}

func (uc *SearchPokemonAndTrainerUseCase) SearchPokemonAndTrainerList(ctx context.Context, q string) (*SearchPokemonAndTrainerUseCaseDto, error) {
	searchPokemonList, err := uc.pokemonQueryService.SearchPokemonList(ctx, q)
	if err != nil {
		return nil, err
	}

	searchTrainerList, err := uc.trainerQueryService.SearchTrainerList(ctx, q)
	if err != nil {
		return nil, err
	}

	dto := &SearchPokemonAndTrainerUseCaseDto{
		Pokemons: make([]*pokemon.SearchPokemonUseCaseDto, 0),
		Trainers: make([]*trainer.SearchTrainerUseCaseDto, 0),
	}

	for _, f := range searchPokemonList {
		dto.Pokemons = append(dto.Pokemons, &pokemon.SearchPokemonUseCaseDto{
			ID:         fmt.Sprintf("%v", f.ID),
			Name:       f.Name,
			EnergyType: f.EnergyType,
			Hp:         f.Hp,
			ImageURL:   f.ImageURL,
		})
	}

	for _, f := range searchTrainerList {
		dto.Trainers = append(dto.Trainers, &trainer.SearchTrainerUseCaseDto{
			ID:          fmt.Sprintf("%v", f.ID),
			Name:        f.Name,
			TrainerType: f.TrainerType,
			ImageURL:    f.ImageURL,
		})
	}

	return dto, nil
}

func (uc *SearchPokemonAndTrainerUseCase) SearchPokemonList(ctx context.Context, q string) (*SearchPokemonAndTrainerUseCaseDto, error) {
	searchPokemonList, err := uc.pokemonQueryService.SearchPokemonList(ctx, q)
	if err != nil {
		return nil, err
	}

	dto := &SearchPokemonAndTrainerUseCaseDto{
		Pokemons: make([]*pokemon.SearchPokemonUseCaseDto, 0),
		Trainers: make([]*trainer.SearchTrainerUseCaseDto, 0),
	}

	for _, f := range searchPokemonList {
		dto.Pokemons = append(dto.Pokemons, &pokemon.SearchPokemonUseCaseDto{
			ID:         fmt.Sprintf("%v", f.ID),
			Name:       f.Name,
			EnergyType: f.EnergyType,
			Hp:         f.Hp,
			ImageURL:   f.ImageURL,
		})
	}

	return dto, nil
}

func (uc *SearchPokemonAndTrainerUseCase) SearchTrainerList(ctx context.Context, q string) (*SearchPokemonAndTrainerUseCaseDto, error) {
	searchTrainerList, err := uc.trainerQueryService.SearchTrainerList(ctx, q)
	if err != nil {
		return nil, err
	}

	dto := &SearchPokemonAndTrainerUseCaseDto{
		Pokemons: make([]*pokemon.SearchPokemonUseCaseDto, 0),
		Trainers: make([]*trainer.SearchTrainerUseCaseDto, 0),
	}

	for _, f := range searchTrainerList {
		dto.Trainers = append(dto.Trainers, &trainer.SearchTrainerUseCaseDto{
			ID:          fmt.Sprintf("%v", f.ID),
			Name:        f.Name,
			TrainerType: f.TrainerType,
			ImageURL:    f.ImageURL,
		})
	}

	return dto, nil
}
