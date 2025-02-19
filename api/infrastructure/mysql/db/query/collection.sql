-- name: CollectionFindByUserId :many
SELECT 
    i.id,
    COALESCE(p.id, t.id) AS card_id,
    i.card_type_id AS card_type_id,
    COALESCE(p.name, t.name) AS name,
    COALESCE(p.description, t.description) AS description,
    COALESCE(p.image_url, t.image_url) AS image_url,
    i.quantity
FROM inventories i
LEFT JOIN pokemons p ON i.card_id = p.id AND i.card_type_id = 1
LEFT JOIN trainers t ON i.card_id = t.id AND i.card_type_id = 2
WHERE user_id = sqlc.arg(user_id);
