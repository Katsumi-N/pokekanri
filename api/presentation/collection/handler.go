package collection

import (
	"api/application/collection"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type collectionHandler struct {
	FetchCollectionUseCase *collection.FetchCollectionUseCase
}

func NewCollectionHandler(fetchCollectionUseCase *collection.FetchCollectionUseCase) *collectionHandler {
	return &collectionHandler{
		FetchCollectionUseCase: fetchCollectionUseCase,
	}
}

// FetchCollection godoc
// @Summary Fetch collection
// @Description Fetch collection
// @Tags collection
// @Accept json
// @Produce json
// @Success 200 {object} fetchCollectionReponse
// @Router /v1/cards/collections [get]
func (h *collectionHandler) FetchCollection(c echo.Context) error {
	token, ok := c.Get("user").(*jwt.Token)
	if !ok {
		return c.JSON(http.StatusUnauthorized, fetchCollectionErrResponse{
			Result:  false,
			Message: "User authentication failed",
		})
	}
	claims := token.Claims.(jwt.MapClaims)
	userId := claims["sub"].(string)

	collection, err := h.FetchCollectionUseCase.FetchCollection(c.Request().Context(), userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, fetchCollectionErrResponse{
			Result:  false,
			Message: err.Error(),
		})
	}

	var res fetchCollectionReponse
	res.Result = true
	for _, dto := range collection {
		res.Cards = append(res.Cards, Card{
			InventoryId: dto.Id,
			CardName:    dto.CardName,
			CardId:      dto.CardId,
			CardTypeId:  dto.CardTypeId,
			ImageUrl:    dto.ImageUrl,
			Quantity:    dto.Quantity,
		})
	}
	return c.JSON(http.StatusOK, res)
}
