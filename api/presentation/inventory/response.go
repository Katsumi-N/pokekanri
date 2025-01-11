package inventory

type storeCardResponse struct {
	Result bool `json:"result"`
}

type storeCardErrResponse struct {
	Result  bool   `json:"result"`
	Message string `json:"message"`
}
