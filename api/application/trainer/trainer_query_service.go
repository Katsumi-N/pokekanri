package trainer

import "context"

type SearchTrainerList struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	TrainerType string `json:"trainer_type"`
}

type TrainerQueryService interface {
	SearchTrainerList(ctx context.Context, q string) ([]*SearchTrainerList, error)
}
