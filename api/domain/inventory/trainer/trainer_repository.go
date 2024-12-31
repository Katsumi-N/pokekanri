package trainer

import (
	"context"
	"time"
)

type TrainerRepository interface {
	Save(ctx context.Context, trainer *Trainer, userId string, quantity int, now time.Time) error
	FindById(ctx context.Context, trainerId string) (*Trainer, error)
}
