package inventory

import (
	"api/application/inventory"
	"api/pkg/validator"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

type inventoryHandler struct {
	storePokemonUseCase *inventory.StorePokemonUseCase
	storeTrainerUseCase *inventory.StoreTrainerUseCase
}

func NewInventoryHandler(storePokemonUseCase *inventory.StorePokemonUseCase, storeTrainerUseCase *inventory.StoreTrainerUseCase) *inventoryHandler {
	return &inventoryHandler{
		storePokemonUseCase: storePokemonUseCase,
		storeTrainerUseCase: storeTrainerUseCase,
	}
}

// StoreCard godoc
// @Summary Store a card to inventory
// @Tags inventory
// @Accept json
// @Produce json
// @Param card_type query string true "Card type"
// @Param card_id query int true "Card ID"
// @Param quantity query int true "Quantity"
// @Success 200 {object} storeCardResponse
// @Router /v1/cards/inventories [post]
func (h *inventoryHandler) StoreCard(c echo.Context) error {
	var req PostStoreCardRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	validate := validator.GetValidator()
	if err := validate.Struct(req); err != nil {
		return c.JSON(http.StatusBadRequest, storeCardErrResponse{
			Result:  false,
			Message: err.Error(),
		})
	}

	switch req.CardType {
	case "pokemon":
		dto := inventory.StorePokemonCardUseCaseDto{
			PokemonId: req.CardId,
			Quantity:  req.Quantity,
		}
		err := h.storePokemonUseCase.Save(c.Request().Context(), req.UserId, dto, time.Now())
		if err != nil {
			return c.JSON(500, storeCardErrResponse{
				Result:  false,
				Message: err.Error(),
			})
		}
		return c.JSON(200, storeCardResponse{
			Result: true,
		})
	case "trainer":
		dto := inventory.StoreTrainerCardUseCaseDto{
			TrainerId: req.CardId,
			Quantity:  req.Quantity,
		}
		err := h.storeTrainerUseCase.Save(c.Request().Context(), req.UserId, dto, time.Now())
		if err != nil {
			return c.JSON(500, err.Error())
		}
		return c.JSON(200, storeCardResponse{
			Result: true,
		})
	default:
		return c.JSON(400, storeCardErrResponse{
			Result:  false,
			Message: "invalid card type",
		})
	}
}
