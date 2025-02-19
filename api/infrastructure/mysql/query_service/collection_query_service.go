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

func (s *collectionQueryService) FetchCollection(ctx context.Context, userId string) ([]*collection.FetchCollectionDto, error) {
	query := db.GetQuery(ctx)
	colResult, err := query.CollectionFindByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}

	var collectionDtos []*collection.FetchCollectionDto
	for _, c := range colResult {
		dto := &collection.FetchCollectionDto{
			Id:         int(c.ID),
			CardName:   c.Name,
			CardId:     int(c.CardID),
			CardTypeId: int(c.CardTypeID),
			ImageUrl:   c.ImageUrl,
			Quantity:   int(c.Quantity),
		}
		collectionDtos = append(collectionDtos, dto)
	}

	return collectionDtos, nil
}
