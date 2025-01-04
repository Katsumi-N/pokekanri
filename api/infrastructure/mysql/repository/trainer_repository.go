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
		CardTypeID: 1,
		Quantity:   int32(quantity),
	}); err != nil {
		return err
	}
	return nil
}
