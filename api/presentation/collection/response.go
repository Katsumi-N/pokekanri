package collection

type fetchCollectionReponse struct {
	Result bool   `json:"result"`
	Cards  []Card `json:"cards"`
}

type fetchCollectionErrResponse struct {
	Result  bool   `json:"result"`
	Message string `json:"message"`
}

type Card struct {
	InventoryId     int    `json:"inventory_id"`
	CardId          int    `json:"card_id"`
	CardTypeId      int    `json:"card_type_id"`
	CardName        string `json:"card_name"`
	CardDescription string `json:"card_description"`
	ImageUrl        string `json:"image_url"`
	Quantity        int    `json:"quantity"`
}
