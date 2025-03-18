package collection

import (
	applicationCollection "api/application/collection"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
)

type collectionHandler struct {
	FetchCollectionUseCase *applicationCollection.FetchCollectionUseCase
}

func NewCollectionHandler(fetchCollectionUseCase *applicationCollection.FetchCollectionUseCase) *collectionHandler {
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

	res := fetchCollectionReponse{
		Result: true,
		Pokemons: lo.Map(collection.Pokemons, func(p *applicationCollection.CollectionDto, _ int) Card {
			return Card{
				InventoryId: p.Id,
				CardId:      p.CardId,
				CardName:    p.CardName,
				ImageUrl:    p.ImageUrl,
				Quantity:    p.Quantity,
			}
		}),
		Trainers: lo.Map(collection.Trainers, func(t *applicationCollection.CollectionDto, _ int) Card {
			return Card{
				InventoryId: t.Id,
				CardId:      t.CardId,
				CardName:    t.CardName,
				ImageUrl:    t.ImageUrl,
				Quantity:    t.Quantity,
			}
		}),
		Energies: lo.Map(collection.Energies, func(e *applicationCollection.CollectionDto, _ int) Card {
			return Card{
				InventoryId: e.Id,
				CardId:      e.CardId,
				CardName:    e.CardName,
				ImageUrl:    e.ImageUrl,
				Quantity:    e.Quantity,
			}
		}),
	}

	return c.JSON(http.StatusOK, res)
}
