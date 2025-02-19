package collection

import "context"

type FetchCollectionDto struct {
	Id         int
	CardId     int
	CardTypeId int
	CardName   string
	ImageUrl   string
	Quantity   int
}

type CollectionQueryService interface {
	FetchCollection(ctx context.Context, userId string) ([]*FetchCollectionDto, error)
}
