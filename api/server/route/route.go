package route

import (
	"api/application/inventory"
	"api/application/search"
	"api/infrastructure/elasticsearch/query_service"
	"api/infrastructure/mysql/repository"
	inventoryPre "api/presentation/inventory"
	searchPre "api/presentation/search"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func InitRoute(e *echo.Echo) {
	e.Use(middleware.Recover())
	v1 := e.Group("/v1")

	cardSearchRoute(v1)
	cardInventoryRoute(v1)
}

func cardSearchRoute(g *echo.Group) {
	pokemonRepository := query_service.NewPokemonQueryService()
	trainerRepository := query_service.NewTrainerQueryService()
	searchRepository := search.NewSearchPokemonAndTrainerUseCase(
		pokemonRepository,
		trainerRepository,
	)
	h := searchPre.NewSearchHandler(searchRepository)

	group := g.Group("/cards")
	group.GET("/search", h.SearchCardList)
}

func cardInventoryRoute(g *echo.Group) {
	pokemonRepository := repository.NewPokemonRepository()
	trainerRepository := repository.NewTrainerRepository()

	pokemonUsecase := inventory.NewStorePokemonUseCase(pokemonRepository)
	trainerUsecase := inventory.NewStoreTrainerUseCase(trainerRepository)
	h := inventoryPre.NewInventoryHandler(pokemonUsecase, trainerUsecase)
	group := g.Group("/cards")
	group.POST("/inventories", h.StoreCard)
}
