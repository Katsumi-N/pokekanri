package inventory

type PostSaveCardRequest struct {
	CardId   int    `json:"card_id" validate:"required"`
	CardType string `json:"card_type" validate:"required"`
	Quantity int    `json:"quantity"`
}
