package sorting

import (
	"context"
	"fmt"
	"time"

	"algorthmia/backend/internal/models"
)

// BaseSort provides common functionality for all sorting algorithms
type BaseSort struct {
	metadata models.Algorithm
}

// NewBaseSort creates a new base sort instance
func NewBaseSort(metadata models.Algorithm) *BaseSort {
	return &BaseSort{
		metadata: metadata,
	}
}

// GetMetadata returns algorithm metadata
func (bs *BaseSort) GetMetadata() models.Algorithm {
	return bs.metadata
}

// ValidateConfig validates the configuration for the algorithm
func (bs *BaseSort) ValidateConfig(config models.AlgorithmConfig) error {
	if config.ArraySize < 1 {
		return fmt.Errorf("array size must be at least 1")
	}
	if config.ArraySize > 1000 {
		return fmt.Errorf("array size cannot exceed 1000")
	}
	if len(config.Data) > 0 && len(config.Data) != config.ArraySize {
		return fmt.Errorf("provided data length (%d) does not match array size (%d)", len(config.Data), config.ArraySize)
	}
	return nil
}

// GetDefaultConfig returns default configuration for the algorithm
func (bs *BaseSort) GetDefaultConfig() models.AlgorithmConfig {
	return models.AlgorithmConfig{
		ArraySize: 20,
		Speed:     5,
		Data:      []int{},
	}
}

// PrepareData prepares data for sorting (generates random data if not provided)
func (bs *BaseSort) PrepareData(config models.AlgorithmConfig) []int {
	data := config.Data
	if len(data) == 0 {
		data = generateRandomData(config.ArraySize)
	}

	// Create a copy to avoid modifying the original
	arr := make([]int, len(data))
	copy(arr, data)
	return arr
}

// CreateStep creates a standardized algorithm step
func (bs *BaseSort) CreateStep(stepNumber int, action string, array []int, highlights []int, metadata map[string]interface{}) models.AlgorithmStep {
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
func (bs *BaseSort) CopyArray(src []int) []int {
	dst := make([]int, len(src))
	copy(dst, src)
	return dst
}

// CheckContextCancellation checks if the context has been cancelled
func (bs *BaseSort) CheckContextCancellation(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	default:
		return nil
	}
}
