package config

import (
	"log"
	"os"
	"strconv"

	"github.com/spf13/viper"
)

// Config holds all configuration for the application
type Config struct {
	Server     ServerConfig    `mapstructure:"server"`
	Logging    LoggingConfig   `mapstructure:"logging"`
	CORS       CORSConfig      `mapstructure:"cors"`
	Algorithms AlgorithmConfig `mapstructure:"algorithms"`
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Host         string `mapstructure:"host"`
	Port         int    `mapstructure:"port"`
	ReadTimeout  int    `mapstructure:"read_timeout"`
	WriteTimeout int    `mapstructure:"write_timeout"`
}

// LoggingConfig holds logging configuration
type LoggingConfig struct {
	Level  string `mapstructure:"level"`
	Format string `mapstructure:"format"`
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string `mapstructure:"allowed_origins"`
	AllowedMethods []string `mapstructure:"allowed_methods"`
	AllowedHeaders []string `mapstructure:"allowed_headers"`
}

// AlgorithmConfig holds algorithm-specific configuration
type AlgorithmConfig struct {
	MaxArraySize     int `mapstructure:"max_array_size"`
	DefaultArraySize int `mapstructure:"default_array_size"`
	MinArraySize     int `mapstructure:"min_array_size"`
	MaxSpeed         int `mapstructure:"max_speed"`
	MinSpeed         int `mapstructure:"min_speed"`
	DefaultSpeed     int `mapstructure:"default_speed"`
}

// Load loads configuration from file and environment variables
func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath("/etc/algorthmia")

	// Set default values
	setDefaults()

	// Enable reading from environment variables
	viper.AutomaticEnv()

	// Read config file
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
		log.Println("No config file found, using defaults and environment variables")
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	// Override with environment variables if set
	overrideWithEnv(&config)

	return &config, nil
}

// setDefaults sets default configuration values
func setDefaults() {
	viper.SetDefault("server.host", "localhost")
	viper.SetDefault("server.port", 8080)
	viper.SetDefault("server.read_timeout", 30)
	viper.SetDefault("server.write_timeout", 30)

	viper.SetDefault("logging.level", "info")
	viper.SetDefault("logging.format", "json")

	viper.SetDefault("cors.allowed_origins", []string{"http://localhost:5173", "http://localhost:3000"})
	viper.SetDefault("cors.allowed_methods", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	viper.SetDefault("cors.allowed_headers", []string{"Origin", "Content-Type", "Accept", "Authorization"})

	viper.SetDefault("algorithms.max_array_size", 100)
	viper.SetDefault("algorithms.default_array_size", 20)
	viper.SetDefault("algorithms.min_array_size", 5)
	viper.SetDefault("algorithms.max_speed", 10)
	viper.SetDefault("algorithms.min_speed", 1)
	viper.SetDefault("algorithms.default_speed", 5)
}

// overrideWithEnv overrides configuration with environment variables
func overrideWithEnv(config *Config) {
	if host := os.Getenv("SERVER_HOST"); host != "" {
		config.Server.Host = host
	}
	if port := os.Getenv("SERVER_PORT"); port != "" {
		if parsedPort, err := strconv.Atoi(port); err == nil && parsedPort > 0 && parsedPort <= 65535 {
			config.Server.Port = parsedPort
		}
	}
	if level := os.Getenv("LOG_LEVEL"); level != "" {
		// Validate log level
		validLevels := map[string]bool{"debug": true, "info": true, "warn": true, "error": true, "fatal": true, "panic": true}
		if validLevels[level] {
			config.Logging.Level = level
		}
	}
}
