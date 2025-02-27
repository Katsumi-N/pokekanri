package collection

import "context"

type FetchCollectionUseCase struct {
	collectionQueryService CollectionQueryService
}

func NewFetchCollectionUseCase(collectionQueryService CollectionQueryService) *FetchCollectionUseCase {
	return &FetchCollectionUseCase{
		collectionQueryService: collectionQueryService,
	}
}

func (uc *FetchCollectionUseCase) FetchCollection(ctx context.Context, userId string) (*FetchCollectionDto, error) {
	collection, err := uc.collectionQueryService.FetchCollection(ctx, userId)
	if err != nil {
		return nil, err
	}

	return collection, nil
}
