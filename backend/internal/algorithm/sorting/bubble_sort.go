package sorting

import (
	"context"
	"fmt"

	"algorthmia/backend/internal/models"
)

// BubbleSort implements the bubble sort algorithm
type BubbleSort struct {
	*BaseSort
}

// NewBubbleSort creates a new bubble sort algorithm instance
func NewBubbleSort() *BubbleSort {
	metadata := models.Algorithm{
		ID:              "bubble_sort",
		Name:            "Bubble Sort",
		Type:            models.AlgorithmTypeSorting,
		Description:     "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Includes optimizations for early termination.",
		TimeComplexity:  "O(n²)",
		SpaceComplexity: "O(1)",
		Category:        "Comparison Sort",
		Enabled:         true,
	}

	return &BubbleSort{
		BaseSort: NewBaseSort(metadata),
	}
}

// Execute runs the bubble sort algorithm
func (bs *BubbleSort) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	// Validate configuration
	if err := bs.ValidateConfig(config); err != nil {
		return nil, err
	}

	// Prepare data using base class method
	arr := bs.PrepareData(config)

	var steps []models.AlgorithmStep
	stepNumber := 0

	// Add initial step
	steps = append(steps, bs.createStep(
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
		steps = append(steps, bs.createStep(
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
			steps = append(steps, bs.createStep(
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
				steps = append(steps, bs.createStep(
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
				steps = append(steps, bs.createStep(
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
				steps = append(steps, bs.createStep(
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
		steps = append(steps, bs.createStep(
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

	// Add final step with verification
	steps = append(steps, bs.createStep(
		stepNumber,
		"complete",
		arr,
		[]int{},
		map[string]interface{}{
			"description": "Optimized bubble sort completed",
			"total_steps": stepNumber + 1,
			"is_sorted":   isSorted(arr),
		},
	))

	return steps, nil
}

// GetDefaultConfig returns default configuration for bubble sort
func (bs *BubbleSort) GetDefaultConfig() models.AlgorithmConfig {
	config := bs.BaseSort.GetDefaultConfig()
	config.CustomParams = map[string]interface{}{
		"show_comparisons":  true,
		"show_swaps":        true,
		"early_termination": true,
	}
	return config
}

// createStep creates a new algorithm step using the base class method
func (bs *BubbleSort) createStep(stepNumber int, action string, data []int, highlights []int, metadata map[string]interface{}) models.AlgorithmStep {
	step := bs.CreateStep(stepNumber, action, data, highlights, metadata)
	step.Action = action
	return step
}
