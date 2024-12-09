package card

import (
	"api/application/card"
	"fmt"
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
	cardType := c.QueryParam("card_type")
	fmt.Println(cardType)
	dto, err := func(cardType string) (*card.SearchPokemonAndTrainerUseCaseDto, error) {
		switch cardType {
		case "pokemon":
			return h.searchCardUseCase.SearchPokemonList(c.Request().Context(), q)
		case "trainers":
			return h.searchCardUseCase.SearchTrainerList(c.Request().Context(), q)
		default:
			return h.searchCardUseCase.SearchPokemonAndTrainerList(c.Request().Context(), q)
		}
	}(cardType)
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
			ImageURL:   dtoPokemon.ImageURL,
		})
	}

	for _, dtoTrainer := range dto.Trainers {
		res.Trainers = append(res.Trainers, &trainer{
			ID:          dtoTrainer.ID,
			Name:        dtoTrainer.Name,
			TrainerType: dtoTrainer.TrainerType,
			ImageURL:    dtoTrainer.ImageURL,
		})
	}

	return c.JSON(http.StatusOK, res)
}
