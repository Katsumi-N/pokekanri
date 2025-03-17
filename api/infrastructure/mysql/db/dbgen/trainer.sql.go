// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: trainer.sql

package dbgen

import (
	"context"
)

const trainerFindById = `-- name: TrainerFindById :one
SELECT id, name, trainer_type, image_url, description, regulation, expansion, created_at, updated_at FROM trainers
WHERE id = ? LIMIT 1
`

func (q *Queries) TrainerFindById(ctx context.Context, id int64) (Trainer, error) {
	row := q.db.QueryRowContext(ctx, trainerFindById, id)
	var i Trainer
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.TrainerType,
		&i.ImageUrl,
		&i.Description,
		&i.Regulation,
		&i.Expansion,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
