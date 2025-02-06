package config

import (
	"sync"

	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Server Server
	DB     DBConfig
	JWT    JWT
}

type DBConfig struct {
	Name     string `envconfig:"DB_DATABASE" default:"pokekanridb"`
	User     string `envconfig:"DB_USER" default:"root"`
	Password string `envconfig:"DB_PASS" default:"pass"`
	Port     string `envconfig:"DB_PORT" default:"13306"`
	Host     string `envconfig:"DB_HOST" default:"localhost"`
}

type Server struct {
	Address string `envconfig:"ADDRESS" default:"0.0.0.0"`
	Port    string `envconfig:"PORT" default:"8080"`
}

type JWT struct {
	Secret string `envconfig:"JWT_SECRET" default:"super-secret-jwt-token-with-at-least-32-characters-long"`
}

var (
	once   sync.Once
	config Config
)

func GetConfig() *Config {
	// goroutine実行中でも一度だけ実行される
	once.Do(func() {
		if err := envconfig.Process("", &config); err != nil {
			panic(err)
		}
	})
	return &config
}
