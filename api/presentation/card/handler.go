package card

import (
	"api/application/card"
	"net/http"

	"github.com/labstack/echo/v4"
)

type handler struct {
	searchCardUseCase *card.SearchPokemonAndTrainerUseCase
}

func NewHandler(searchCardUseCase *card.SearchPokemonAndTrainerUseCase) handler {
	return handler{searchCardUseCase}
}

// SearchCardList godoc
// @Summary Search card list
// @Tags cards
// @Accept json
// @Produce json
// @Success 200 {object} getProductsResponse
// @Router /v1/cards/search [get]
func (h *handler) SearchCardList(c echo.Context) error {
	q := c.QueryParam("q")
	dto, err := h.searchCardUseCase.SearchPokemonAndTrainerList(c.Request().Context(), q)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	var res searchCardResponse
	res.Result = true
	for _, dtoPokemon := range dto.Pokemons {
		res.Pokemons = append(res.Pokemons, &pokemon{
			ID:         dtoPokemon.ID,
			Name:       dtoPokemon.Name,
			EnergyType: dtoPokemon.EnergyType,
			Hp:         dtoPokemon.Hp,
		})
	}

	for _, dtoTrainer := range dto.Trainers {
		res.Trainers = append(res.Trainers, &trainer{
			ID:          dtoTrainer.ID,
			Name:        dtoTrainer.Name,
			TrainerType: dtoTrainer.TrainerType,
		})
	}

	return c.JSON(http.StatusOK, res)
}
