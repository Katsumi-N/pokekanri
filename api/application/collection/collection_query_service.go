package collection

import "context"

type CollectionDto struct {
	Id       int
	CardId   int
	CardName string
	ImageUrl string
	Quantity int
}

type FetchCollectionDto struct {
	Pokemons []*CollectionDto
	Trainers []*CollectionDto
}

type CollectionQueryService interface {
	FetchCollection(ctx context.Context, userId string) (*FetchCollectionDto, error)
}
