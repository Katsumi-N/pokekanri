package query_service

import (
	"api/application/collection"
	"api/infrastructure/mysql/db"
	"context"
)

type collectionQueryService struct{}

func NewCollectionQueryService() collection.CollectionQueryService {
	return &collectionQueryService{}
}

func (s *collectionQueryService) FetchCollection(ctx context.Context, userId string) (*collection.FetchCollectionDto, error) {
	query := db.GetQuery(ctx)
	colResult, err := query.CollectionFindByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}

	collectionDto := &collection.FetchCollectionDto{
		Pokemons: []*collection.CollectionDto{},
		Trainers: []*collection.CollectionDto{},
	}
	for _, c := range colResult {
		switch c.CardTypeID {
		case 1:
			collectionDto.Pokemons = append(collectionDto.Pokemons, &collection.CollectionDto{
				Id:       int(c.ID),
				CardId:   int(c.CardID),
				CardName: c.Name,
				ImageUrl: c.ImageUrl,
				Quantity: int(c.Quantity),
			})
		case 2:
			collectionDto.Trainers = append(collectionDto.Trainers, &collection.CollectionDto{
				Id:       int(c.ID),
				CardId:   int(c.CardID),
				CardName: c.Name,
				ImageUrl: c.ImageUrl,
				Quantity: int(c.Quantity),
			})
		default:
			return nil, nil
		}

	}

	return collectionDto, nil
}
