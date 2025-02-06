package inventory

import (
	"api/application/inventory"
	"api/pkg/validator"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type inventoryHandler struct {
	SaveInventoryUseCase *inventory.SaveInventoryUseCase
}

func NewCollectionHandler(saveInventoryUseCase *inventory.SaveInventoryUseCase) *inventoryHandler {
	return &inventoryHandler{
		SaveInventoryUseCase: saveInventoryUseCase,
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
func (h *inventoryHandler) SaveCard(c echo.Context) error {
	token, ok := c.Get("user").(*jwt.Token)
	if !ok {
		return c.JSON(http.StatusUnauthorized, storeCardErrResponse{
			Result:  false,
			Message: "User authentication failed",
		})
	}
	claims := token.Claims.(jwt.MapClaims)
	userId := claims["sub"].(string)

	var req PostSaveCardRequest
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

	var cardType int
	switch req.CardType {
	case "pokemon":
		cardType = 1
	case "trainer":
		cardType = 2
	case "energy":
		cardType = 3
	default:
		return c.JSON(http.StatusBadRequest, storeCardErrResponse{
			Result:  false,
			Message: "invalid card type",
		})
	}

	err := h.SaveInventoryUseCase.SaveInventory(c.Request().Context(), userId, req.CardId, cardType, req.Quantity)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, storeCardErrResponse{
			Result:  false,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, storeCardResponse{
		Result: true,
	})
}
