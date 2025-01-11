package inventory

type PostStoreCardRequest struct {
	UserId   string `json:"user_id" validate:"required"`
	CardId   int    `json:"card_id" validate:"required"`
	CardType string `json:"card_type" validate:"required"`
	Quantity int    `json:"quantity" validate:"gt=0"`
}
