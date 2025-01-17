// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: inventory.sql

package dbgen

import (
	"context"
)

const insertInventory = `-- name: InsertInventory :exec
INSERT INTO inventories (
    user_id, card_id, card_type_id, quantity
) VALUES (
    ?, 
    ?,
    ?,
    ?
)
`

type InsertInventoryParams struct {
	UserID     string `json:"user_id"`
	CardID     int64  `json:"card_id"`
	CardTypeID int64  `json:"card_type_id"`
	Quantity   int32  `json:"quantity"`
}

func (q *Queries) InsertInventory(ctx context.Context, arg InsertInventoryParams) error {
	_, err := q.db.ExecContext(ctx, insertInventory,
		arg.UserID,
		arg.CardID,
		arg.CardTypeID,
		arg.Quantity,
	)
	return err
}
