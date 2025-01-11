package inventory

type PostStoreCardRequest struct {
	UserId   string `json:"user_id"`
	CardId   int    `json:"card_id"`
	CardType string `json:"card_type"`
	Quantity int    `json:"quantity"`
}
