package card

type searchCardResponse struct {
	Result   bool       `json:"result"`
	Pokemons []*pokemon `json:"pokemons"`
	Trainers []*trainer `json:"trainers"`
}

type pokemon struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Hp         int    `json:"hp"`
	EnergyType string `json:"energyType"`
}

type trainer struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	TrainerType string `json:"trainerType"`
}
