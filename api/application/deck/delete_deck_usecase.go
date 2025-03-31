package deck

import (
	"api/domain/deck"
	"context"
	"errors"
)

type IDeleteDeckUseCase interface {
	DeleteDeck(ctx context.Context, userId string, deckId int) error
}

type DeleteDeckUseCase struct {
	deckRepository deck.DeckRepository
}

func NewDeleteDeckUseCase(deckRepository deck.DeckRepository) *DeleteDeckUseCase {
	return &DeleteDeckUseCase{
		deckRepository: deckRepository,
	}
}

func (u *DeleteDeckUseCase) DeleteDeck(ctx context.Context, userId string, deckId int) error {
	deck, _ := u.deckRepository.FindById(ctx, deckId)
	if deck == nil {
		return errors.New("デッキが見つかりません")
	}
	if deck.GetUserID() != userId {
		return errors.New("このデッキを削除する権限がありません")
	}
	err := u.deckRepository.Delete(ctx, deckId)
	if err != nil {
		return err
	}
	return nil
}
