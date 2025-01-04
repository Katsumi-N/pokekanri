package route

import (
	"api/application/search"
	"api/infrastructure/elasticsearch/query_service"
	searchPre "api/presentation/search"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func InitRoute(e *echo.Echo) {
	e.Use(middleware.Recover())
	v1 := e.Group("/v1")

	cardSearchRoute(v1)
}

func cardSearchRoute(g *echo.Group) {
	pokemonRepository := query_service.NewPokemonQueryService()
	trainerRepository := query_service.NewTrainerQueryService()
	searchRepository := search.NewSearchPokemonAndTrainerUseCase(
		pokemonRepository,
		trainerRepository,
	)
	h := searchPre.NewHandler(searchRepository)

	group := g.Group("/cards")
	group.GET("/search", h.SearchCardList)
}

// func inventoryRoute(g *echo.Group) {
// 	pokemonRepository := repository.NewPokemonRepository()
// 	trainerRepository := repository.NewTrainerRepository()

// 	h := cardPre.NewHandler(cardRepository)
// 	group := g.Group("/inventories")
// 	group.POST("/pokemon", h.StoreCard)
// 	group.POST("/trainer", h.StoreCard)
// }
