package trainer

import (
	"testing"
)

func TestNewTrainer(t *testing.T) {
	tests := map[string]struct {
		id          int
		name        string
		trainerType string
		description string
		imageUrl    string
		expectError bool
	}{
		"valid": {
			id:          1,
			name:        "ハイパーボール",
			trainerType: Item,
			description: "好きなポケモン1枚",
			imageUrl:    "https://example.com/hyperball.png",
			expectError: false,
		},
		"invalid trainer type": {
			id:          2,
			name:        "ネストボール",
			trainerType: "",
			description: "ベンチにたねポケモン",
			imageUrl:    "https://example.com/nestball.png",
			expectError: true,
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			trainer, err := NewTrainer(tt.id, tt.name, tt.trainerType, tt.description, tt.imageUrl)
			if tt.expectError {
				if err == nil {
					t.Errorf("expected error for input %v, got nil", tt)
				}
			} else {
				if err != nil {
					t.Errorf("unexpected error for input %v: %v", tt, err)
				}
				if trainer.id != tt.id || trainer.name != tt.name || trainer.trainerType != tt.trainerType || trainer.description != tt.description || trainer.imageUrl != tt.imageUrl {
					t.Errorf("expected %v, got %v", tt, trainer)
				}
			}
		})
	}
}
