package query_service

import (
	"api/application/pokemon"
	"context"
	"encoding/json"
	"log"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

type pokemonQueryService struct{}

func NewPokemonQueryService() pokemon.PokemonQueryService {
	return &pokemonQueryService{}
}

func (s *pokemonQueryService) SearchPokemonList(ctx context.Context, q string) ([]*pokemon.SearchPokemonList, error) {
	es, err := elasticsearch.NewTypedClient(elasticsearch.Config{
		Addresses: []string{
			"http://localhost:19200",
		},
	})
	if err != nil {
		log.Println("error creating elasticsearch client: ", err)
		return nil, err
	}

	req := &search.Request{
		Query: &types.Query{
			Bool: &types.BoolQuery{
				Must: []types.Query{
					{
						Match: map[string]types.MatchQuery{
							"name": {Query: q},
						},
					},
				},
				Should: []types.Query{
					{
						Match: map[string]types.MatchQuery{
							"description": {Query: q},
						},
					},
				},
			},
		},
	}
	res, err := es.Search().Index("pokemon").Request(req).Do(ctx)
	if err != nil {
		log.Println("error searching elasticsearch: ", err)
		return nil, err
	}

	var searchPokemonList []*pokemon.SearchPokemonList
	for _, hit := range res.Hits.Hits {
		var p *pokemon.SearchPokemonList
		if err := json.Unmarshal(hit.Source_, &p); err != nil {
			log.Println("error unmarshalling hit source: ", err)
			return nil, err
		}
		searchPokemonList = append(searchPokemonList, p)
	}

	return searchPokemonList, nil
}
