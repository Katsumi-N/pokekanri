package inventory

import (
	"api/application/inventory"
	"api/domain"
	"api/pkg/validator"
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type inventoryHandler struct {
	SaveInventoryUseCase *inventory.SaveInventoryUseCase
}

func NewInventoryHandler(saveInventoryUseCase *inventory.SaveInventoryUseCase) *inventoryHandler {
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
		fmt.Println("User authentication failed")
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

	cardType, ok := domain.StringToCardType[req.CardType]
	if !ok {
		return c.JSON(http.StatusBadRequest, storeCardErrResponse{
			Result:  false,
			Message: "invalid card type",
		})
	}

	err := h.SaveInventoryUseCase.SaveInventory(c.Request().Context(), userId, req.CardId, int(cardType), req.Quantity, req.Increment)
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
