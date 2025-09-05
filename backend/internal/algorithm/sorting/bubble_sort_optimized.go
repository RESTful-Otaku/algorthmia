package sorting

import (
	"context"
	"fmt"

	"algorthmia/backend/internal/models"
)

// BubbleSortOptimized implements an optimized bubble sort algorithm
type BubbleSortOptimized struct {
	metadata models.Algorithm
}

// NewBubbleSortOptimized creates a new optimized bubble sort algorithm instance
func NewBubbleSortOptimized() *BubbleSortOptimized {
	return &BubbleSortOptimized{
		metadata: models.Algorithm{
			ID:              "bubble_sort_optimized",
			Name:            "Bubble Sort (Optimized)",
			Type:            models.AlgorithmTypeSorting,
			Description:     "An optimized version of bubble sort that reduces unnecessary comparisons and includes early termination.",
			TimeComplexity:  "O(n²) - O(n) best case",
			SpaceComplexity: "O(1)",
			Category:        "Comparison Sort",
			Enabled:         true,
		},
	}
}

// Execute runs the optimized bubble sort algorithm
func (bs *BubbleSortOptimized) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	// Validate configuration
	if err := bs.ValidateConfig(config); err != nil {
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
	steps = append(steps, createStep(
		stepNumber,
		"initialize",
		arr,
		[]int{},
		map[string]interface{}{
			"description": "Starting optimized bubble sort algorithm",
			"array_size":  len(arr),
		},
	))
	stepNumber++

	n := len(arr)
	swapped := true

	for i := 0; i < n-1 && swapped; i++ {
		swapped = false

		// Add step showing current pass
		steps = append(steps, createStep(
			stepNumber,
			"pass_start",
			arr,
			[]int{i},
			map[string]interface{}{
				"description":  fmt.Sprintf("Starting pass %d", i+1),
				"pass":         i + 1,
				"total_passes": n - 1,
			},
		))
		stepNumber++

		for j := 0; j < n-i-1; j++ {
			// Check for context cancellation
			select {
			case <-ctx.Done():
				return steps, ctx.Err()
			default:
			}

			// Add step showing comparison
			steps = append(steps, createStep(
				stepNumber,
				"compare",
				arr,
				[]int{j, j + 1},
				map[string]interface{}{
					"description": fmt.Sprintf("Comparing %d and %d", arr[j], arr[j+1]),
					"left_index":  j,
					"right_index": j + 1,
					"left_value":  arr[j],
					"right_value": arr[j+1],
				},
			))
			stepNumber++

			if arr[j] > arr[j+1] {
				// Add step showing swap
				steps = append(steps, createStep(
					stepNumber,
					"swap",
					arr,
					[]int{j, j + 1},
					map[string]interface{}{
						"description": fmt.Sprintf("Swapping %d and %d", arr[j], arr[j+1]),
						"left_index":  j,
						"right_index": j + 1,
						"left_value":  arr[j],
						"right_value": arr[j+1],
					},
				))
				stepNumber++

				// Perform the swap
				arr[j], arr[j+1] = arr[j+1], arr[j]
				swapped = true

				// Add step showing after swap
				steps = append(steps, createStep(
					stepNumber,
					"swap_complete",
					arr,
					[]int{j, j + 1},
					map[string]interface{}{
						"description": fmt.Sprintf("Swapped %d and %d", arr[j+1], arr[j]),
						"left_index":  j,
						"right_index": j + 1,
						"left_value":  arr[j],
						"right_value": arr[j+1],
					},
				))
				stepNumber++
			} else {
				// Add step showing no swap needed
				steps = append(steps, createStep(
					stepNumber,
					"no_swap",
					arr,
					[]int{j, j + 1},
					map[string]interface{}{
						"description": fmt.Sprintf("No swap needed: %d <= %d", arr[j], arr[j+1]),
						"left_index":  j,
						"right_index": j + 1,
						"left_value":  arr[j],
						"right_value": arr[j+1],
					},
				))
				stepNumber++
			}
		}

		// Add step showing pass completion
		steps = append(steps, createStep(
			stepNumber,
			"pass_complete",
			arr,
			[]int{},
			map[string]interface{}{
				"description": fmt.Sprintf("Pass %d complete", i+1),
				"pass":        i + 1,
				"swapped":     swapped,
			},
		))
		stepNumber++
	}

	// Add final step
	steps = append(steps, createStep(
		stepNumber,
		"complete",
		arr,
		[]int{},
		map[string]interface{}{
			"description": "Optimized bubble sort completed",
			"total_steps": stepNumber + 1,
		},
	))

	return steps, nil
}

// GetMetadata returns algorithm metadata
func (bs *BubbleSortOptimized) GetMetadata() models.Algorithm {
	return bs.metadata
}

// ValidateConfig validates the configuration for optimized bubble sort
func (bs *BubbleSortOptimized) ValidateConfig(config models.AlgorithmConfig) error {
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

// GetDefaultConfig returns default configuration for optimized bubble sort
func (bs *BubbleSortOptimized) GetDefaultConfig() models.AlgorithmConfig {
	return models.AlgorithmConfig{
		ArraySize: 20,
		Speed:     5,
		Data:      []int{},
		CustomParams: map[string]interface{}{
			"show_comparisons": true,
			"show_swaps":       true,
			"early_termination": true,
		},
	}
}
