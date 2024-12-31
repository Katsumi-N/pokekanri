package inventory

import (
	"context"
	"errors"
	"testing"
	"time"

	"go.uber.org/mock/gomock"

	"api/domain/inventory/trainer"
	trainerDomain "api/domain/inventory/trainer"
)

func TestStoreTrainerUseCase_Save(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockTrainerRepo := trainerDomain.NewMockTrainerRepository(ctrl)
	uc := NewStoreTrainerUseCase(mockTrainerRepo)

	ctx := context.Background()
	userId := "testuser"
	now := time.Now()

	tests := map[string]struct {
		dto          StoreTrainerCardUseCaseDto
		mockFindById func()
		mockSave     func()
		expectError  bool
	}{
		"valid_pokemon": {
			dto: StoreTrainerCardUseCaseDto{TrainerId: "001", Quantity: 10},
			mockFindById: func() {
				mockTrainerRepo.EXPECT().FindById(ctx, "001").Return(&trainer.Trainer{}, nil)
			},
			mockSave: func() {
				mockTrainerRepo.EXPECT().Save(ctx, &trainer.Trainer{}, userId, 10, now).Return(nil)
			},
			expectError: false,
		},
		"pokemon_not_found": {
			dto: StoreTrainerCardUseCaseDto{TrainerId: "002", Quantity: 5},
			mockFindById: func() {
				mockTrainerRepo.EXPECT().FindById(ctx, "002").Return(nil, nil)
			},
			mockSave:    func() {},
			expectError: true,
		},
		"find_error": {
			dto: StoreTrainerCardUseCaseDto{TrainerId: "003", Quantity: 3},
			mockFindById: func() {
				mockTrainerRepo.EXPECT().FindById(ctx, "003").Return(nil, errors.New("find error"))
			},
			mockSave:    func() {},
			expectError: true,
		},
		"save_error": {
			dto: StoreTrainerCardUseCaseDto{TrainerId: "004", Quantity: 7},
			mockFindById: func() {
				mockTrainerRepo.EXPECT().FindById(ctx, "004").Return(&trainer.Trainer{}, nil)
			},
			mockSave: func() {
				mockTrainerRepo.EXPECT().Save(ctx, &trainer.Trainer{}, userId, 7, now).Return(errors.New("save error"))
			},
			expectError: true,
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			tt.mockFindById()
			tt.mockSave()

			err := uc.Save(ctx, userId, tt.dto, now)
			if tt.expectError {
				if err == nil {
					t.Errorf("expected error for input %v, got nil", tt)
				}
			} else {
				if err != nil {
					t.Errorf("unexpected error for input %v: %v", tt, err)
				}
			}
		})
	}
}
