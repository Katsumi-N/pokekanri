package inventory

import "context"

type InventoryRepository interface {
	Save(ctx context.Context, userId string, cardId int, cardTypeId int, quantity int) error
	Update(ctx context.Context, id int, quantity int) error
	FindCardFromInventory(ctx context.Context, userId string, cardId int, cardTypeId int) (*Inventory, error)
	Delete(ctx context.Context, id int) error
}
