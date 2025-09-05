package algorithm

import (
	"context"
	"fmt"
	"sync"

	"algorthmia/backend/internal/models"
)

// manager implements the Manager interface
type manager struct {
	algorithms map[string]Executor
	mutex      sync.RWMutex
}

// NewManager creates a new algorithm manager
func NewManager() Manager {
	return &manager{
		algorithms: make(map[string]Executor),
	}
}

// RegisterAlgorithm registers a new algorithm
func (m *manager) RegisterAlgorithm(executor Executor) error {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	metadata := executor.GetMetadata()
	if metadata.ID == "" {
		return fmt.Errorf("algorithm ID cannot be empty")
	}

	if _, exists := m.algorithms[metadata.ID]; exists {
		return fmt.Errorf("algorithm with ID %s already exists", metadata.ID)
	}

	m.algorithms[metadata.ID] = executor
	return nil
}

// GetAlgorithm returns an algorithm by ID
func (m *manager) GetAlgorithm(id string) (Executor, error) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	executor, exists := m.algorithms[id]
	if !exists {
		return nil, fmt.Errorf("algorithm with ID %s not found", id)
	}

	return executor, nil
}

// ListAlgorithms returns all available algorithms
func (m *manager) ListAlgorithms() []models.Algorithm {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	algorithms := make([]models.Algorithm, 0, len(m.algorithms))
	for _, executor := range m.algorithms {
		algorithms = append(algorithms, executor.GetMetadata())
	}

	return algorithms
}

// ListAlgorithmsByType returns algorithms filtered by type
func (m *manager) ListAlgorithmsByType(algorithmType models.AlgorithmType) []models.Algorithm {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	algorithms := make([]models.Algorithm, 0)
	for _, executor := range m.algorithms {
		metadata := executor.GetMetadata()
		if metadata.Type == algorithmType {
			algorithms = append(algorithms, metadata)
		}
	}

	return algorithms
}

// ExecuteAlgorithm executes an algorithm with the given configuration
func (m *manager) ExecuteAlgorithm(ctx context.Context, algorithmID string, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	executor, err := m.GetAlgorithm(algorithmID)
	if err != nil {
		return nil, err
	}

	// Validate configuration
	if err := executor.ValidateConfig(config); err != nil {
		return nil, fmt.Errorf("invalid configuration: %w", err)
	}

	// Execute algorithm
	steps, err := executor.Execute(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("algorithm execution failed: %w", err)
	}

	return steps, nil
}
