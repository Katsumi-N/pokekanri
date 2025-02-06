package repository

import (
	"api/domain/inventory"
	"api/domain/inventory/pokemon"
	"api/domain/inventory/trainer"
	"api/infrastructure/mysql/db"
	"api/infrastructure/mysql/db/dbgen"
	"context"
	"errors"
)

type inventoryRepository struct{}

func NewInventoryRepository() *inventoryRepository {
	return &inventoryRepository{}
}

func (r *inventoryRepository) Save(ctx context.Context, inventory *inventory.Inventory, userId string) error {
	query := db.GetQuery(ctx)
	err := query.InsertInventory(ctx, dbgen.InsertInventoryParams{
		UserID:     userId,
		CardID:     int64(inventory.GetCard().GetId()),
		CardTypeID: int64(inventory.GetCard().GetCardTypeId()),
		Quantity:   int32(inventory.GetQuantity()),
	})
	if err != nil {
		return err
	}

	return nil
}

func (r *inventoryRepository) Update(ctx context.Context, id int, quantity int) error {
	query := db.GetQuery(ctx)
	err := query.UpdateInventoryQuantity(ctx, dbgen.UpdateInventoryQuantityParams{
		ID:       int64(id),
		Quantity: int32(quantity),
	})
	if err != nil {
		return err
	}

	return nil
}

func (r *inventoryRepository) FindCardFromInventory(ctx context.Context, userId string, cardId int, cardTypeId int) (*inventory.Inventory, error) {
	query := db.GetQuery(ctx)
	card, err := query.FindCardFromInventory(ctx, dbgen.FindCardFromInventoryParams{
		UserID:     userId,
		CardID:     int64(cardId),
		CardTypeID: int64(cardTypeId),
	})
	if err != nil {
		return nil, err
	}

	switch cardTypeId {
	case 1:
		p, err := pokemon.NewPokemon(
			int(card.CardID),
			card.Name.String,
			card.EnergyType.String,
			int(card.Hp.Int64),
			card.Description.String,
		)
		if err != nil {
			return nil, err
		}
		return inventory.NewInventory(
			int(card.ID),
			p,
			int(card.Quantity),
		), nil
	case 2:
		t, err := trainer.NewTrainer(
			int(card.CardID),
			card.Name.String,
			card.TrainerType.String,
			card.Description.String,
		)
		if err != nil {
			return nil, err
		}
		return inventory.NewInventory(
			int(card.ID),
			t,
			int(card.Quantity),
		), nil
	default:
		return nil, errors.New("invalid card type")
	}
}

func (r *inventoryRepository) Delete(ctx context.Context, id int) error {
	query := db.GetQuery(ctx)
	err := query.DeleteCardFromInventory(ctx, int64(id))
	if err != nil {
		return err
	}

	return nil
}
