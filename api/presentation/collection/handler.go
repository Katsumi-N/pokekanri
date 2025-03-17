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

	for _, p := range collection.Pokemons {
		res.Pokemons = append(res.Pokemons, Card{
			InventoryId: p.Id,
			CardId:      p.CardId,
			CardName:    p.CardName,
			ImageUrl:    p.ImageUrl,
			Quantity:    p.Quantity,
		})
	}

	for _, t := range collection.Trainers {
		res.Trainers = append(res.Trainers, Card{
			InventoryId: t.Id,
			CardId:      t.CardId,
			CardName:    t.CardName,
			ImageUrl:    t.ImageUrl,
			Quantity:    t.Quantity,
		})
	}

	return c.JSON(http.StatusOK, res)
}
