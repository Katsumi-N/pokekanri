package query_service

import (
	"api/application/detail"
	errDomain "api/domain/error"
	"api/infrastructure/mysql/db"
	"context"
	"database/sql"
	"log"
)

// type DetailQueryService interface {
// 	FindPokemonDetail(pokemonId int) (*Pokemon, error)
// 	FindTrainerDetail(trainerId int) (*Trainer, error)
// 	FindEnergyDetail(energyId int) (*Energy, error)
// }

type detailQueryService struct{}

func NewDetailQueryService() detail.DetailQueryService {
	return &detailQueryService{}
}

func (s *detailQueryService) FindPokemonDetail(ctx context.Context, pokemonId int) (*detail.Pokemon, error) {
	query := db.GetQuery(ctx)
	p, err := query.PokemonFindById(ctx, int64(pokemonId))
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errDomain.NotFoundErr
		}
		log.Printf("error in PokemonFindById err: %v", err)
		return nil, err
	}

	pa, err := query.PokemonAttackFindByPokemonId(ctx, int64(pokemonId))
	if err != nil {
		log.Printf("error in PokemonAttackFindByPokemonId err: %v", err)
		return nil, err
	}

	pokemonAttacks := make([]detail.PokemonAttack, 0)
	for _, a := range pa {
		pokemonAttacks = append(pokemonAttacks, detail.PokemonAttack{
			Name:           a.Name,
			RequiredEnergy: a.RequiredEnergy,
			Damage:         a.Damage.String,
			Description:    a.Description.String,
		})
	}

	pd := detail.Pokemon{
		Id:                 int(p.ID),
		Name:               p.Name,
		EnergyType:         p.EnergyType,
		Hp:                 int(p.Hp),
		Ability:            p.Ability.String,
		AbilityDescription: p.AbilityDescription.String,
		ImageUrl:           p.ImageUrl,
		Regulation:         p.Regulation,
		Expansion:          p.Expansion,
		Attacks:            pokemonAttacks,
	}

	return &pd, nil
}

func (s *detailQueryService) FindTrainerDetail(ctx context.Context, trainerId int) (*detail.Trainer, error) {
	query := db.GetQuery(ctx)
	t, err := query.TrainerFindById(ctx, int64(trainerId))
	if err != nil {
		log.Printf("error in TrainerFindById err: %v", err)
		return nil, err
	}

	responseTrainer := detail.Trainer{
		Id:          int(t.ID),
		Name:        t.Name,
		TrainerType: t.TrainerType,
		Description: t.Description,
		ImageUrl:    t.ImageUrl,
		Regulation:  t.Regulation,
		Expansion:   t.Expansion,
	}

	return &responseTrainer, nil
}

func (s *detailQueryService) FindEnergyDetail(ctx context.Context, energyId int) (*detail.Energy, error) {
	query := db.GetQuery(ctx)

	e, err := query.EnergyFindById(ctx, int64(energyId))
	if err != nil {
		log.Printf("error in EnergyFindById err: %v", err)
		return nil, err
	}

	res := detail.Energy{
		Id:          int(e.ID),
		Name:        e.Name,
		ImageUrl:    e.ImageUrl,
		Description: e.Description,
		Regulation:  e.Regulation,
		Expansion:   e.Expansion,
	}

	return &res, nil
}
