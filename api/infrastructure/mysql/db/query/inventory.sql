-- name: InsertInventory :exec
INSERT INTO inventories (
    user_id, card_id, card_type_id, quantity
) VALUES (
    sqlc.arg(user_id), 
    sqlc.arg(card_id),
    sqlc.arg(card_type_id),
    sqlc.arg(quantity)
); 

-- name: FindCardFromInventory :one
SELECT * FROM inventories i
LEFT JOIN
    pokemons p ON i.card_id = p.id AND i.card_type_id = 1
LEFT JOIN
    trainers t ON i.card_id = t.id AND i.card_type_id = 2
WHERE i.user_id = sqlc.arg(user_id) AND i.card_id = sqlc.arg(card_id) AND i.card_type_id = sqlc.arg(card_type_id) 
LIMIT 1;

-- name: DeleteCardFromInventory :exec
DELETE FROM inventories
WHERE id = sqlc.arg(id);

-- name: UpdateInventoryQuantity :exec
UPDATE inventories
SET quantity = sqlc.arg(quantity)
WHERE id = sqlc.arg(id);

-- name: InventoryFindByUserId :many
SELECT * FROM inventories
WHERE user_id = sqlc.arg(user_id);
