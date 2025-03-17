package collection

type fetchCollectionReponse struct {
	Result   bool   `json:"result"`
	Pokemons []Card `json:"pokemons"`
	Trainers []Card `json:"trainers"`
}

type fetchCollectionErrResponse struct {
	Result  bool   `json:"result"`
	Message string `json:"message"`
}

type Card struct {
	InventoryId int    `json:"inventory_id"`
	CardId      int    `json:"card_id"`
	CardName    string `json:"card_name"`
	ImageUrl    string `json:"image_url"`
	Quantity    int    `json:"quantity"`
}
