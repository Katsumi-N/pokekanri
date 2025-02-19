package pokemon

import (
	"testing"
)

func TestNewPokemon(t *testing.T) {
	tests := map[string]struct {
		id          int
		name        string
		energyType  string
		hp          int
		description string
		imageUrl    string
		expectError bool
	}{
		"valid": {
			id:          1,
			name:        "ピカチュウ",
			energyType:  Electric,
			hp:          120,
			description: "ぴかぴか",
			imageUrl:    "https://example.com/pikachu.png",
			expectError: false,
		},
		"invalid energy type": {
			id:          2,
			name:        "ラルトス",
			energyType:  "Fairy",
			hp:          120,
			description: "フェアリーがなくなった",
			imageUrl:    "https://example.com/ralts.png",
			expectError: true,
		},
		"invalid hp": {
			id:          3,
			name:        "ホゲータ",
			energyType:  Fire,
			hp:          -10,
			description: "ほげほげ",
			imageUrl:    "https://example.com/hoge.png",
			expectError: true,
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			pokemon, err := NewPokemon(tt.id, tt.name, tt.energyType, tt.hp, tt.description, tt.imageUrl)
			if tt.expectError {
				if err == nil {
					t.Errorf("expected error for input %v, got nil", tt)
				}
			} else {
				if err != nil {
					t.Errorf("unexpected error for input %v: %v", tt, err)
				}
				if pokemon.id != tt.id || pokemon.name != tt.name || pokemon.energyType != tt.energyType || pokemon.hp != tt.hp || pokemon.description != tt.description || pokemon.imageUrl != tt.imageUrl {
					t.Errorf("expected %v, got %v", tt, pokemon)
				}
			}
		})
	}
}
