package sorting

import (
	"context"
	"fmt"
	"time"

	"algorthmia/backend/internal/models"
)

// BubbleSort implements the bubble sort algorithm
type BubbleSort struct {
	metadata models.Algorithm
}

// NewBubbleSort creates a new bubble sort algorithm instance
func NewBubbleSort() *BubbleSort {
	return &BubbleSort{
		metadata: models.Algorithm{
			ID:              "bubble_sort",
			Name:            "Bubble Sort",
			Type:            models.AlgorithmTypeSorting,
			Description:     "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
			TimeComplexity:  "O(n²)",
			SpaceComplexity: "O(1)",
			Category:        "Comparison Sort",
			Enabled:         true,
		},
	}
}

// Execute runs the bubble sort algorithm
func (bs *BubbleSort) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
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
	steps = append(steps, models.AlgorithmStep{
		StepNumber: stepNumber,
		Action:     "initialize",
		Data:       make([]int, len(arr)),
		Highlights: []int{},
		Metadata: map[string]interface{}{
			"description": "Starting bubble sort algorithm",
			"array_size":  len(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)
	stepNumber++

	n := len(arr)
	swapped := true

	for i := 0; i < n-1 && swapped; i++ {
		swapped = false

		// Add step showing current pass
		steps = append(steps, models.AlgorithmStep{
			StepNumber: stepNumber,
			Action:     "pass_start",
			Data:       make([]int, len(arr)),
			Highlights: []int{i},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Starting pass %d", i+1),
				"pass":        i + 1,
				"total_passes": n - 1,
			},
			Timestamp: time.Now(),
		})
		copy(steps[stepNumber].Data, arr)
		stepNumber++

		for j := 0; j < n-i-1; j++ {
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
				Highlights: []int{j, j + 1},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Comparing %d and %d", arr[j], arr[j+1]),
					"left_index":  j,
					"right_index": j + 1,
					"left_value":  arr[j],
					"right_value": arr[j+1],
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++

			if arr[j] > arr[j+1] {
				// Add step showing swap
				steps = append(steps, models.AlgorithmStep{
					StepNumber: stepNumber,
					Action:     "swap",
					Data:       make([]int, len(arr)),
					Highlights: []int{j, j + 1},
					Metadata: map[string]interface{}{
						"description": fmt.Sprintf("Swapping %d and %d", arr[j], arr[j+1]),
						"left_index":  j,
						"right_index": j + 1,
						"left_value":  arr[j],
						"right_value": arr[j+1],
					},
					Timestamp: time.Now(),
				})
				copy(steps[stepNumber].Data, arr)
				stepNumber++

				// Perform the swap
				arr[j], arr[j+1] = arr[j+1], arr[j]
				swapped = true

				// Add step showing after swap
				steps = append(steps, models.AlgorithmStep{
					StepNumber: stepNumber,
					Action:     "swap_complete",
					Data:       make([]int, len(arr)),
					Highlights: []int{j, j + 1},
					Metadata: map[string]interface{}{
						"description": fmt.Sprintf("Swapped %d and %d", arr[j+1], arr[j]),
						"left_index":  j,
						"right_index": j + 1,
						"left_value":  arr[j],
						"right_value": arr[j+1],
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
					Highlights: []int{j, j + 1},
					Metadata: map[string]interface{}{
						"description": fmt.Sprintf("No swap needed: %d <= %d", arr[j], arr[j+1]),
						"left_index":  j,
						"right_index": j + 1,
						"left_value":  arr[j],
						"right_value": arr[j+1],
					},
					Timestamp: time.Now(),
				})
				copy(steps[stepNumber].Data, arr)
				stepNumber++
			}
		}

		// Add step showing pass completion
		steps = append(steps, models.AlgorithmStep{
			StepNumber: stepNumber,
			Action:     "pass_complete",
			Data:       make([]int, len(arr)),
			Highlights: []int{},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Pass %d complete", i+1),
				"pass":        i + 1,
				"swapped":     swapped,
			},
			Timestamp: time.Now(),
		})
		copy(steps[stepNumber].Data, arr)
		stepNumber++
	}

	// Add final step
	steps = append(steps, models.AlgorithmStep{
		StepNumber: stepNumber,
		Action:     "complete",
		Data:       make([]int, len(arr)),
		Highlights: []int{},
		Metadata: map[string]interface{}{
			"description": "Bubble sort completed",
			"total_steps": stepNumber + 1,
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)

	return steps, nil
}

// GetMetadata returns algorithm metadata
func (bs *BubbleSort) GetMetadata() models.Algorithm {
	return bs.metadata
}

// ValidateConfig validates the configuration for bubble sort
func (bs *BubbleSort) ValidateConfig(config models.AlgorithmConfig) error {
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

// GetDefaultConfig returns default configuration for bubble sort
func (bs *BubbleSort) GetDefaultConfig() models.AlgorithmConfig {
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
