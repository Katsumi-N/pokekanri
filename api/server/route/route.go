package route

import (
	"api/application/card"
	"api/infrastructure/elasticsearch/query_service"
	cardPre "api/presentation/card"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func InitRoute(e *echo.Echo) {
	e.Use(middleware.Recover())
	v1 := e.Group("/v1")

	searchRoute(v1)
}

func searchRoute(g *echo.Group) {
	pokemonRepository := query_service.NewPokemonQueryService()
	trainerRepository := query_service.NewTrainerQueryService()
	cardRepository := card.NewSearchPokemonAndTrainerUseCase(
		pokemonRepository,
		trainerRepository,
	)
	h := cardPre.NewHandler(cardRepository)

	group := g.Group("/search")
	group.GET("/pokemon", h.SearchCardList)
}