package algorithm

import (
	"context"
	"algorthmia/backend/internal/models"
)

// Executor defines the interface for algorithm execution
type Executor interface {
	// Execute runs the algorithm and returns steps
	Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error)
	
	// GetMetadata returns algorithm metadata
	GetMetadata() models.Algorithm
	
	// ValidateConfig validates the configuration for the algorithm
	ValidateConfig(config models.AlgorithmConfig) error
	
	// GetDefaultConfig returns default configuration for the algorithm
	GetDefaultConfig() models.AlgorithmConfig
}

// Manager manages algorithm execution and provides a registry
type Manager interface {
	// RegisterAlgorithm registers a new algorithm
	RegisterAlgorithm(executor Executor) error
	
	// GetAlgorithm returns an algorithm by ID
	GetAlgorithm(id string) (Executor, error)
	
	// ListAlgorithms returns all available algorithms
	ListAlgorithms() []models.Algorithm
	
	// ListAlgorithmsByType returns algorithms filtered by type
	ListAlgorithmsByType(algorithmType models.AlgorithmType) []models.Algorithm
	
	// ExecuteAlgorithm executes an algorithm with the given configuration
	ExecuteAlgorithm(ctx context.Context, algorithmID string, config models.AlgorithmConfig) ([]models.AlgorithmStep, error)
}
