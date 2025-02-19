package inventory

import (
	errDomain "api/domain/error"
	inventoryDomain "api/domain/inventory"
	"context"
	"fmt"
)

type SaveInventoryUseCase struct {
	inventoryRepo inventoryDomain.InventoryRepository
}

func NewUpdateCollectionUseCase(inventoryRepo inventoryDomain.InventoryRepository) *SaveInventoryUseCase {
	return &SaveInventoryUseCase{
		inventoryRepo: inventoryRepo,
	}
}

func (u *SaveInventoryUseCase) SaveInventory(ctx context.Context, userId string, cardId int, cardTypeId int, quantity int) error {
	inv, err := u.inventoryRepo.FindCardFromInventory(ctx, userId, cardId, cardTypeId)
	if err != nil && err != errDomain.NotFoundErr {
		fmt.Println("application inventory SaveInventoryUseCase FindCardFromInventory error: ", err)
		return err
	}

	if quantity <= 0 {
		return u.inventoryRepo.Delete(ctx, inv.GetID())
	}

	if inv != nil {
		return u.inventoryRepo.Update(ctx, inv.GetID(), quantity)
	} else {
		return u.inventoryRepo.Save(ctx, userId, cardId, cardTypeId, quantity)
	}
}
