package route

import (
	"api/application/inventory"
	"api/application/search"
	"api/config"
	"api/infrastructure/elasticsearch/query_service"
	"api/infrastructure/mysql/repository"
	inventoryPre "api/presentation/inventory"
	searchPre "api/presentation/search"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func InitRoute(e *echo.Echo) {
	e.Use(middleware.Recover())

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "time=${time_rfc3339_nano}, method=${method}, uri=${uri}, status=${status}\n",
	}))

	jwtSecret := config.GetConfig().JWT.Secret
	jwtMiddleware := echojwt.WithConfig(echojwt.Config{
		SigningKey: []byte(jwtSecret),
	})

	v1 := e.Group("/v1")

	cardSearchRoute(v1)
	cardInventoryRoute(v1, jwtMiddleware)
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

func cardInventoryRoute(g *echo.Group, jwtMiddleware echo.MiddlewareFunc) {

	inventoryRepo := repository.NewInventoryRepository()
	inventoryUseCase := inventory.NewUpdateCollectionUseCase(inventoryRepo)

	h := inventoryPre.NewCollectionHandler(inventoryUseCase)

	group := g.Group("/cards", jwtMiddleware)
	group.POST("/inventories", h.SaveCard)
}
