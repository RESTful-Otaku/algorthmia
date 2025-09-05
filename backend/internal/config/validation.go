package config

import (
	"fmt"
	"net/url"
	"strings"
)

// ValidateConfig validates the configuration
func (c *Config) ValidateConfig() error {
	// Validate server configuration
	if err := c.validateServerConfig(); err != nil {
		return fmt.Errorf("server config validation failed: %w", err)
	}

	// Validate CORS configuration
	if err := c.validateCORSConfig(); err != nil {
		return fmt.Errorf("CORS config validation failed: %w", err)
	}

	// Validate algorithms configuration
	if err := c.validateAlgorithmsConfig(); err != nil {
		return fmt.Errorf("algorithms config validation failed: %w", err)
	}

	// Validate logging configuration
	if err := c.validateLoggingConfig(); err != nil {
		return fmt.Errorf("logging config validation failed: %w", err)
	}

	return nil
}

// validateServerConfig validates server configuration
func (c *Config) validateServerConfig() error {
	if c.Server.Host == "" {
		return fmt.Errorf("server host cannot be empty")
	}

	if c.Server.Port <= 0 || c.Server.Port > 65535 {
		return fmt.Errorf("server port must be between 1 and 65535, got %d", c.Server.Port)
	}

	if c.Server.ReadTimeout <= 0 {
		return fmt.Errorf("server read timeout must be positive, got %d", c.Server.ReadTimeout)
	}

	if c.Server.WriteTimeout <= 0 {
		return fmt.Errorf("server write timeout must be positive, got %d", c.Server.WriteTimeout)
	}

	return nil
}

// validateCORSConfig validates CORS configuration
func (c *Config) validateCORSConfig() error {
	// Validate allowed origins
	for _, origin := range c.CORS.AllowedOrigins {
		if origin == "*" {
			continue // Allow wildcard
		}
		if _, err := url.Parse(origin); err != nil {
			return fmt.Errorf("invalid CORS origin: %s", origin)
		}
	}

	// Validate allowed methods
	validMethods := map[string]bool{
		"GET":     true,
		"POST":    true,
		"PUT":     true,
		"DELETE":  true,
		"PATCH":   true,
		"HEAD":    true,
		"OPTIONS": true,
	}

	for _, method := range c.CORS.AllowedMethods {
		if !validMethods[strings.ToUpper(method)] {
			return fmt.Errorf("invalid CORS method: %s", method)
		}
	}

	// Validate allowed headers
	for _, header := range c.CORS.AllowedHeaders {
		if strings.TrimSpace(header) == "" {
			return fmt.Errorf("CORS header cannot be empty")
		}
	}

	return nil
}

// validateAlgorithmsConfig validates algorithms configuration
func (c *Config) validateAlgorithmsConfig() error {
	if c.Algorithms.MaxArraySize <= 0 {
		return fmt.Errorf("max array size must be positive, got %d", c.Algorithms.MaxArraySize)
	}

	if c.Algorithms.MinArraySize <= 0 {
		return fmt.Errorf("min array size must be positive, got %d", c.Algorithms.MinArraySize)
	}

	if c.Algorithms.MinArraySize > c.Algorithms.MaxArraySize {
		return fmt.Errorf("min array size (%d) cannot be greater than max array size (%d)",
			c.Algorithms.MinArraySize, c.Algorithms.MaxArraySize)
	}

	if c.Algorithms.DefaultArraySize < c.Algorithms.MinArraySize ||
		c.Algorithms.DefaultArraySize > c.Algorithms.MaxArraySize {
		return fmt.Errorf("default array size (%d) must be between min (%d) and max (%d)",
			c.Algorithms.DefaultArraySize, c.Algorithms.MinArraySize, c.Algorithms.MaxArraySize)
	}

	if c.Algorithms.MaxSpeed <= 0 {
		return fmt.Errorf("max speed must be positive, got %d", c.Algorithms.MaxSpeed)
	}

	if c.Algorithms.MinSpeed <= 0 {
		return fmt.Errorf("min speed must be positive, got %d", c.Algorithms.MinSpeed)
	}

	if c.Algorithms.MinSpeed > c.Algorithms.MaxSpeed {
		return fmt.Errorf("min speed (%d) cannot be greater than max speed (%d)",
			c.Algorithms.MinSpeed, c.Algorithms.MaxSpeed)
	}

	if c.Algorithms.DefaultSpeed < c.Algorithms.MinSpeed ||
		c.Algorithms.DefaultSpeed > c.Algorithms.MaxSpeed {
		return fmt.Errorf("default speed (%d) must be between min (%d) and max (%d)",
			c.Algorithms.DefaultSpeed, c.Algorithms.MinSpeed, c.Algorithms.MaxSpeed)
	}

	return nil
}

// validateLoggingConfig validates logging configuration
func (c *Config) validateLoggingConfig() error {
	validLevels := map[string]bool{
		"debug": true,
		"info":  true,
		"warn":  true,
		"error": true,
		"fatal": true,
	}

	if !validLevels[c.Logging.Level] {
		return fmt.Errorf("invalid logging level: %s, must be one of: debug, info, warn, error, fatal", c.Logging.Level)
	}

	validFormats := map[string]bool{
		"text": true,
		"json": true,
	}

	if !validFormats[c.Logging.Format] {
		return fmt.Errorf("invalid logging format: %s, must be one of: text, json", c.Logging.Format)
	}

	return nil
}

// GetDefaultConfig returns a default configuration
func GetDefaultConfig() *Config {
	return &Config{
		Server: ServerConfig{
			Host:         "localhost",
			Port:         8080,
			ReadTimeout:  30,
			WriteTimeout: 30,
		},
		Logging: LoggingConfig{
			Level:  "info",
			Format: "text",
		},
		CORS: CORSConfig{
			AllowedOrigins: []string{"*"},
			AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowedHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		},
		Algorithms: AlgorithmConfig{
			MaxArraySize:     1000,
			MinArraySize:     1,
			DefaultArraySize: 20,
			MaxSpeed:         10,
			MinSpeed:         1,
			DefaultSpeed:     5,
		},
	}
}
