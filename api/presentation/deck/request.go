package deck

// CreateDeck Request
type createDeckRequest struct {
	Name        string                   `json:"name"`
	Description string                   `json:"description"`
	MainCard    *cardIDRequest           `json:"main_card,omitempty"`
	SubCard     *cardIDRequest           `json:"sub_card,omitempty"`
	Cards       []deckCardWithQtyRequest `json:"cards"`
}

type cardIDRequest struct {
	ID       int    `json:"id"`
	Category string `json:"category"`
}

type deckCardWithQtyRequest struct {
	ID       int    `json:"id"`
	Category string `json:"category"`
	Quantity int    `json:"quantity"`
}

// ValidateDeck Request
type validateDeckRequest struct {
	Name        string                   `json:"name"`
	Description string                   `json:"description"`
	MainCard    *cardIDRequest           `json:"main_card,omitempty"`
	SubCard     *cardIDRequest           `json:"sub_card,omitempty"`
	Cards       []deckCardWithQtyRequest `json:"cards"`
}
