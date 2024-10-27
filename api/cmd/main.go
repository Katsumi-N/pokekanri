package main

import (
	"api/server"
	"context"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	server.Run(ctx)
}
