package config

import (
	"os"
)

type Config struct {
	Port        string
	Environment string
	Debug       bool
}

func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "8080"),
		Environment: getEnv("ENVIRONMENT", "development"),
		Debug:       getEnv("DEBUG", "false") == "true",
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
