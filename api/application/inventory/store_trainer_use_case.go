package inventory

import (
	trainerDomain "api/domain/inventory/trainer"
	"context"
	"errors"
	"time"
)

type StoreTrainerUseCase struct {
	trainerRepo trainerDomain.TrainerRepository
}

func NewStoreTrainerUseCase(trainerRepo trainerDomain.TrainerRepository) *StoreTrainerUseCase {
	return &StoreTrainerUseCase{
		trainerRepo: trainerRepo,
	}
}

type StoreTrainerCardUseCaseDto struct {
	TrainerId string
	Quantity  int
}

func (uc *StoreTrainerUseCase) Save(ctx context.Context, userId string, dto StoreTrainerCardUseCaseDto, now time.Time) error {
	trainer, err := uc.getValidTrainer(ctx, dto)
	if err != nil {
		return err
	}
	return uc.trainerRepo.Save(ctx, trainer, userId, dto.Quantity, now)
}

func (uc *StoreTrainerUseCase) getValidTrainer(ctx context.Context, dto StoreTrainerCardUseCaseDto) (*trainerDomain.Trainer, error) {
	trainer, err := uc.trainerRepo.FindById(ctx, dto.TrainerId)
	if err != nil {
		return nil, err
	}

	if trainer == nil {
		return nil, errors.New("trainer not found")
	}

	return trainer, nil
}
