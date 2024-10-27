package query_service

import (
	"api/application/trainer"
	"context"
	"encoding/json"
	"log"

	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/typedapi/core/search"
	"github.com/elastic/go-elasticsearch/v8/typedapi/types"
)

type trainerQueryService struct{}

func NewTrainerQueryService() trainer.TrainerQueryService {
	return &trainerQueryService{}
}

func (s *trainerQueryService) SearchTrainerList(ctx context.Context, q string) ([]*trainer.SearchTrainerList, error) {
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
	res, err := es.Search().Index("trainer").Request(req).Do(ctx)
	if err != nil {
		log.Println("error searching elasticsearch: ", err)
		return nil, err
	}

	var searchTrainerList []*trainer.SearchTrainerList
	for _, hit := range res.Hits.Hits {
		var p *trainer.SearchTrainerList
		if err := json.Unmarshal(hit.Source_, &p); err != nil {
			log.Println("error unmarshalling hit source: ", err)
			return nil, err
		}
		searchTrainerList = append(searchTrainerList, p)
	}

	return searchTrainerList, nil
}
