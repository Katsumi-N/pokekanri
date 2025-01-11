package repository

import (
	"api/domain/inventory/trainer"
	"api/infrastructure/mysql/db"
	"api/infrastructure/mysql/db/dbgen"
	"context"
	"time"
)

type trainerRepository struct{}

func NewTrainerRepository() *trainerRepository {
	return &trainerRepository{}
}

func (r *trainerRepository) Save(ctx context.Context, trainer *trainer.Trainer, userId string, quantity int, now time.Time) error {
	query := db.GetQuery(ctx)

	if err := query.InsertInventory(ctx, dbgen.InsertInventoryParams{
		UserID:     userId,
		CardID:     int64(trainer.Id()),
		CardTypeID: 2,
		Quantity:   int32(quantity),
	}); err != nil {
		return err
	}
	return nil
}

func (r *trainerRepository) FindById(ctx context.Context, trainerId int) (*trainer.Trainer, error) {
	query := db.GetQuery(ctx)

	t, err := query.TrainerFindById(ctx, int64(trainerId))
	if err != nil {
		return nil, err
	}

	td, err := trainer.NewTrainer(
		int(t.ID),
		t.Name,
		t.TrainerType,
		t.Description,
	)
	if err != nil {
		return nil, err
	}

	return td, nil
}
