package deck

// GetUserDecks Response
type getUserDecksResponse struct {
	Result bool        `json:"result"`
	Decks  interface{} `json:"decks"`
}

// CreateDeck Response
type createDeckResponse struct {
	Result bool        `json:"result"`
	Deck   interface{} `json:"deck"`
}

// ValidateDeck Response
type validateDeckResponse struct {
	Result  bool     `json:"result"`
	IsValid bool     `json:"is_valid"`
	Errors  []string `json:"errors,omitempty"`
}
