package search

import (
	"context"
	"fmt"
	"time"

	"algorthmia/backend/internal/models"
)

// BaseSearch provides common functionality for all search algorithms
type BaseSearch struct {
	metadata models.Algorithm
}

// NewBaseSearch creates a new base search instance
func NewBaseSearch(metadata models.Algorithm) *BaseSearch {
	return &BaseSearch{
		metadata: metadata,
	}
}

// GetMetadata returns algorithm metadata
func (bs *BaseSearch) GetMetadata() models.Algorithm {
	return bs.metadata
}

// ValidateConfig validates the configuration for the algorithm
func (bs *BaseSearch) ValidateConfig(config models.AlgorithmConfig) error {
	if config.ArraySize < 1 {
		return fmt.Errorf("array size must be at least 1")
	}
	if config.ArraySize > 1000 {
		return fmt.Errorf("array size cannot exceed 1000")
	}
	if len(config.Data) > 0 && len(config.Data) != config.ArraySize {
		return fmt.Errorf("provided data length (%d) does not match array size (%d)", len(config.Data), config.ArraySize)
	}

	// Check if target value is provided for search algorithms
	if target, exists := config.CustomParams["target"]; exists {
		if targetInt, ok := target.(float64); ok {
			if int(targetInt) < 1 || int(targetInt) > 100 {
				return fmt.Errorf("target value must be between 1 and 100")
			}
		} else {
			return fmt.Errorf("target value must be a number")
		}
	}

	return nil
}

// GetDefaultConfig returns default configuration for the algorithm
func (bs *BaseSearch) GetDefaultConfig() models.AlgorithmConfig {
	return models.AlgorithmConfig{
		ArraySize: 20,
		Speed:     5,
		Data:      []int{},
		CustomParams: map[string]interface{}{
			"target": 42, // Default target value to search for
		},
	}
}

// PrepareData prepares data for searching (generates sorted data if not provided)
func (bs *BaseSearch) PrepareData(config models.AlgorithmConfig) []int {
	data := config.Data
	if len(data) == 0 {
		data = generateSortedData(config.ArraySize)
	}

	// Create a copy to avoid modifying the original
	arr := make([]int, len(data))
	copy(arr, data)
	return arr
}

// CreateStep creates a standardized algorithm step
func (bs *BaseSearch) CreateStep(stepNumber int, action string, array []int, highlights []int, metadata map[string]interface{}) models.AlgorithmStep {
	// Create a copy of the array to avoid memory leaks
	stepData := make([]int, len(array))
	copy(stepData, array)

	// Create a copy of highlights
	stepHighlights := make([]int, len(highlights))
	copy(stepHighlights, highlights)

	return models.AlgorithmStep{
		StepNumber: stepNumber,
		Action:     action,
		Data:       stepData,
		Highlights: stepHighlights,
		Metadata:   metadata,
		Timestamp:  time.Now(),
	}
}

// CopyArray creates a deep copy of an array
func (bs *BaseSearch) CopyArray(src []int) []int {
	dst := make([]int, len(src))
	copy(dst, src)
	return dst
}

// CheckContextCancellation checks if the context has been cancelled
func (bs *BaseSearch) CheckContextCancellation(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	default:
		return nil
	}
}

// GetTargetValue extracts the target value from config
func (bs *BaseSearch) GetTargetValue(config models.AlgorithmConfig) int {
	if target, exists := config.CustomParams["target"]; exists {
		if targetInt, ok := target.(float64); ok {
			return int(targetInt)
		}
	}
	return 42 // Default target
}

