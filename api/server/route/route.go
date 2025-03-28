package route

import (
	"api/application/collection"
	"api/application/detail"
	"api/application/inventory"
	"api/application/search"
	"api/config"
	elasticQueryService "api/infrastructure/elasticsearch/query_service"
	mysqlQueryService "api/infrastructure/mysql/query_service"
	"api/infrastructure/mysql/repository"
	collectionPre "api/presentation/collection"
	detailPre "api/presentation/detail"
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

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{config.GetConfig().FrontendConfig.BaseUrl}, // フロントエンドのURLを指定
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	v1 := e.Group("/v1")

	cardSearchRoute(v1)
	cardDetailRoute(v1)
	cardInventoryRoute(v1, jwtMiddleware)
	cardCollectionRoute(v1, jwtMiddleware)
}

func cardSearchRoute(g *echo.Group) {
	pokemonRepository := elasticQueryService.NewPokemonQueryService()
	trainerRepository := elasticQueryService.NewTrainerQueryService()
	energyRepository := elasticQueryService.NewEnergyQueryService()
	searchRepository := search.NewSearchPokemonAndTrainerUseCase(
		pokemonRepository,
		trainerRepository,
		energyRepository,
	)
	h := searchPre.NewSearchHandler(searchRepository)

	group := g.Group("/cards")
	group.GET("/search", h.SearchCardList)
}

func cardDetailRoute(g *echo.Group) {
	detailRepository := mysqlQueryService.NewDetailQueryService()
	detailUseCase := detail.NewFetchDetailUseCase(detailRepository)
	h := detailPre.NewDetailHandler(detailUseCase)

	group := g.Group("/cards")
	group.GET("/detail/:card_type/:id", h.FetchDetail)
}

func cardInventoryRoute(g *echo.Group, jwtMiddleware echo.MiddlewareFunc) {
	inventoryRepo := repository.NewInventoryRepository()
	inventoryUseCase := inventory.NewUpdateCollectionUseCase(inventoryRepo)

	h := inventoryPre.NewInventoryHandler(inventoryUseCase)

	group := g.Group("/cards", jwtMiddleware)
	group.POST("/inventories", h.SaveCard)
}

func cardCollectionRoute(g *echo.Group, jwtMiddleware echo.MiddlewareFunc) {
	collectionQueryService := mysqlQueryService.NewCollectionQueryService()
	collectionUseCase := collection.NewFetchCollectionUseCase(collectionQueryService)

	h := collectionPre.NewCollectionHandler(collectionUseCase)

	group := g.Group("/cards", jwtMiddleware)
	group.GET("/collections", h.FetchCollection)
}
