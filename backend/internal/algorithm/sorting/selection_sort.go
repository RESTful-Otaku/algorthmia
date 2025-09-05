package sorting

import (
	"context"
	"fmt"
	"time"

	"algorthmia/backend/internal/models"
)

// SelectionSort implements the selection sort algorithm
type SelectionSort struct {
	metadata models.Algorithm
}

// NewSelectionSort creates a new selection sort algorithm instance
func NewSelectionSort() *SelectionSort {
	return &SelectionSort{
		metadata: models.Algorithm{
			ID:              "selection_sort",
			Name:            "Selection Sort",
			Type:            models.AlgorithmTypeSorting,
			Description:     "A sorting algorithm that finds the minimum element from the unsorted portion and places it at the beginning.",
			TimeComplexity:  "O(n²)",
			SpaceComplexity: "O(1)",
			Category:        "Comparison Sort",
			Enabled:         true,
		},
	}
}

// Execute runs the selection sort algorithm
func (ss *SelectionSort) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	// Validate configuration
	if err := ss.ValidateConfig(config); err != nil {
		return nil, err
	}

	// Use provided data or generate random data
	data := config.Data
	if len(data) == 0 {
		data = generateRandomData(config.ArraySize)
	}

	// Create a copy to avoid modifying the original
	arr := make([]int, len(data))
	copy(arr, data)

	var steps []models.AlgorithmStep
	stepNumber := 0

	// Add initial step
	steps = append(steps, models.AlgorithmStep{
		StepNumber: stepNumber,
		Action:     "initialize",
		Data:       make([]int, len(arr)),
		Highlights: []int{},
		Metadata: map[string]interface{}{
			"description": "Starting selection sort algorithm",
			"array_size":  len(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)
	stepNumber++

	n := len(arr)

	for i := 0; i < n-1; i++ {
		// Check for context cancellation
		select {
		case <-ctx.Done():
			return steps, ctx.Err()
		default:
		}

		minIdx := i

		// Add step showing current position
		steps = append(steps, models.AlgorithmStep{
			StepNumber: stepNumber,
			Action:     "position_start",
			Data:       make([]int, len(arr)),
			Highlights: []int{i},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Starting from position %d", i),
				"position":    i,
			},
			Timestamp: time.Now(),
		})
		copy(steps[stepNumber].Data, arr)
		stepNumber++

		// Find the minimum element in the remaining array
		for j := i + 1; j < n; j++ {
			// Check for context cancellation
			select {
			case <-ctx.Done():
				return steps, ctx.Err()
			default:
			}

			// Add step showing comparison
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "compare",
				Data:       make([]int, len(arr)),
				Highlights: []int{minIdx, j},
				Metadata: map[string]interface{}{
					"description":   fmt.Sprintf("Comparing %d with current minimum %d", arr[j], arr[minIdx]),
					"current_min":   minIdx,
					"comparing":     j,
					"min_value":     arr[minIdx],
					"compare_value": arr[j],
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++

			if arr[j] < arr[minIdx] {
				minIdx = j

				// Add step showing new minimum found
				steps = append(steps, models.AlgorithmStep{
					StepNumber: stepNumber,
					Action:     "new_minimum",
					Data:       make([]int, len(arr)),
					Highlights: []int{minIdx, j},
					Metadata: map[string]interface{}{
						"description": fmt.Sprintf("New minimum found: %d at position %d", arr[minIdx], minIdx),
						"new_min":     minIdx,
						"min_value":   arr[minIdx],
					},
					Timestamp: time.Now(),
				})
				copy(steps[stepNumber].Data, arr)
				stepNumber++
			} else {
				// Add step showing no change
				steps = append(steps, models.AlgorithmStep{
					StepNumber: stepNumber,
					Action:     "no_change",
					Data:       make([]int, len(arr)),
					Highlights: []int{minIdx, j},
					Metadata: map[string]interface{}{
						"description": fmt.Sprintf("No change: %d >= %d", arr[j], arr[minIdx]),
						"current_min": minIdx,
						"comparing":   j,
					},
					Timestamp: time.Now(),
				})
				copy(steps[stepNumber].Data, arr)
				stepNumber++
			}
		}

		// Swap if minimum is not at current position
		if minIdx != i {
			// Add step showing swap
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "swap",
				Data:       make([]int, len(arr)),
				Highlights: []int{i, minIdx},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Swapping %d and %d", arr[i], arr[minIdx]),
					"from":        i,
					"to":          minIdx,
					"from_value":  arr[i],
					"to_value":    arr[minIdx],
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++

			// Perform the swap
			arr[i], arr[minIdx] = arr[minIdx], arr[i]

			// Add step showing after swap
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "swap_complete",
				Data:       make([]int, len(arr)),
				Highlights: []int{i, minIdx},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Swapped: %d is now in correct position", arr[i]),
					"position":    i,
					"value":       arr[i],
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++
		} else {
			// Add step showing no swap needed
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "no_swap",
				Data:       make([]int, len(arr)),
				Highlights: []int{i},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("No swap needed: %d is already in correct position", arr[i]),
					"position":    i,
					"value":       arr[i],
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++
		}

		// Add step showing position complete
		steps = append(steps, models.AlgorithmStep{
			StepNumber: stepNumber,
			Action:     "position_complete",
			Data:       make([]int, len(arr)),
			Highlights: []int{i},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Position %d is now in correct place", i),
				"position":    i,
				"sorted":      i + 1,
			},
			Timestamp: time.Now(),
		})
		copy(steps[stepNumber].Data, arr)
		stepNumber++
	}

	// Add final step with verification
	steps = append(steps, models.AlgorithmStep{
		StepNumber: stepNumber,
		Action:     "complete",
		Data:       make([]int, len(arr)),
		Highlights: []int{},
		Metadata: map[string]interface{}{
			"description": "Selection sort completed",
			"total_steps": stepNumber + 1,
			"is_sorted":   isSorted(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)

	return steps, nil
}

// GetMetadata returns algorithm metadata
func (ss *SelectionSort) GetMetadata() models.Algorithm {
	return ss.metadata
}

// ValidateConfig validates the configuration for selection sort
func (ss *SelectionSort) ValidateConfig(config models.AlgorithmConfig) error {
	if config.ArraySize < 1 {
		return fmt.Errorf("array size must be at least 1")
	}
	if config.ArraySize > 1000 {
		return fmt.Errorf("array size cannot exceed 1000")
	}
	if len(config.Data) > 0 && len(config.Data) != config.ArraySize {
		return fmt.Errorf("provided data length (%d) must match array size (%d)", len(config.Data), config.ArraySize)
	}
	return nil
}

// GetDefaultConfig returns default configuration for selection sort
func (ss *SelectionSort) GetDefaultConfig() models.AlgorithmConfig {
	return models.AlgorithmConfig{
		ArraySize: 20,
		Speed:     5,
		Data:      []int{},
		CustomParams: map[string]interface{}{
			"show_comparisons": true,
			"show_swaps":       true,
		},
	}
}
