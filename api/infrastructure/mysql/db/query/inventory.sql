-- name: InsertInventory :exec
INSERT INTO inventories (
    user_id, card_id, card_type_id, quantity
) VALUES (
    sqlc.arg(user_id), 
    sqlc.arg(card_id),
    sqlc.arg(card_type_id),
    sqlc.arg(quantity)
); 
