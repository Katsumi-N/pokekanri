package repository

import (
	"api/infrastructure/mysql/db/dbgen"
)

type collectionRepository struct{}

func NewCollectionRepository(queries *dbgen.Queries) *collectionRepository {
	return &collectionRepository{}
}
