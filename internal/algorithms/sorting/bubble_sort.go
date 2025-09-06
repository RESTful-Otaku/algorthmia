package sorting

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// BubbleSort implements the bubble sort algorithm
type BubbleSort struct {
	metadata types.Algorithm
}

// NewBubbleSort creates a new BubbleSort instance
func NewBubbleSort() *BubbleSort {
	return &BubbleSort{
		metadata: types.Algorithm{
			ID:          "bubble_sort",
			Name:        "Bubble Sort",
			Category:    types.CategorySorting,
			Description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
			BigO:        "Time: O(n²), Space: O(1)",
			Parameters: []types.Parameter{
				{
					Name:        "array_size",
					Type:        "int",
					Description: "Size of the array to sort",
					Default:     10,
					Min:         intPtr(3),
					Max:         intPtr(100),
					Required:    true,
				},
				{
					Name:        "show_comparisons",
					Type:        "bool",
					Description: "Show comparison steps in visualization",
					Default:     true,
					Required:    false,
				},
			},
		},
	}
}

// GetMetadata returns the algorithm metadata
func (bs *BubbleSort) GetMetadata() types.Algorithm {
	return bs.metadata
}

// Execute runs the bubble sort algorithm
func (bs *BubbleSort) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
	// Generate array if not provided
	var arr []int
	if input != nil {
		if inputArr, ok := input.([]int); ok {
			arr = inputArr
		} else {
			return nil, fmt.Errorf("invalid input type, expected []int")
		}
	} else {
		// Generate random array
		arraySize := 10
		if size, ok := parameters["array_size"].(int); ok {
			arraySize = size
		}
		arr = generateRandomArray(arraySize)
	}

	showComparisons := true
	if show, ok := parameters["show_comparisons"].(bool); ok {
		showComparisons = show
	}

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"array":            arr,
			"comparisons":      0,
			"swaps":            0,
			"show_comparisons": showComparisons,
		},
		Message:   "Starting Bubble Sort",
		Timestamp: time.Now(),
	})

	n := len(arr)
	comparisons := 0
	swaps := 0
	stepNumber := 1

	// Bubble sort implementation
	for i := 0; i < n-1; i++ {
		swapped := false

		stepCallback(types.ExecutionStep{
			StepNumber: stepNumber,
			Action:     "outer_loop",
			Data: map[string]interface{}{
				"array":       arr,
				"outer_index": i,
				"comparisons": comparisons,
				"swaps":       swaps,
			},
			Message:   fmt.Sprintf("Outer loop iteration %d", i+1),
			Timestamp: time.Now(),
		})
		stepNumber++

		for j := 0; j < n-i-1; j++ {
			comparisons++

			if showComparisons {
				stepCallback(types.ExecutionStep{
					StepNumber: stepNumber,
					Action:     "compare",
					Data: map[string]interface{}{
						"array":       arr,
						"comparing":   []int{j, j + 1},
						"values":      []int{arr[j], arr[j+1]},
						"comparisons": comparisons,
						"swaps":       swaps,
						"outer_index": i,
						"inner_index": j,
					},
					Message:   fmt.Sprintf("Comparing %d and %d", arr[j], arr[j+1]),
					Timestamp: time.Now(),
				})
				stepNumber++
			}

			if arr[j] > arr[j+1] {
				// Swap elements
				arr[j], arr[j+1] = arr[j+1], arr[j]
				swaps++
				swapped = true

				stepCallback(types.ExecutionStep{
					StepNumber: stepNumber,
					Action:     "swap",
					Data: map[string]interface{}{
						"array":       arr,
						"swapped":     []int{j, j + 1},
						"values":      []int{arr[j+1], arr[j]},
						"comparisons": comparisons,
						"swaps":       swaps,
						"outer_index": i,
						"inner_index": j,
					},
					Message:   fmt.Sprintf("Swapped %d and %d", arr[j+1], arr[j]),
					Timestamp: time.Now(),
				})
				stepNumber++
			}
		}

		// Check if array is sorted
		if !swapped {
			stepCallback(types.ExecutionStep{
				StepNumber: stepNumber,
				Action:     "early_termination",
				Data: map[string]interface{}{
					"array":       arr,
					"comparisons": comparisons,
					"swaps":       swaps,
					"outer_index": i,
				},
				Message:   "Array is sorted, terminating early",
				Timestamp: time.Now(),
			})
			stepNumber++
			break
		}
	}

	// Send final result
	stepCallback(types.ExecutionStep{
		StepNumber: stepNumber,
		Action:     "complete",
		Data: map[string]interface{}{
			"array":       arr,
			"comparisons": comparisons,
			"swaps":       swaps,
			"sorted":      true,
		},
		Message:   fmt.Sprintf("Bubble Sort completed with %d comparisons and %d swaps", comparisons, swaps),
		Timestamp: time.Now(),
	})

	return arr, nil
}

// ValidateParameters validates the input parameters
func (bs *BubbleSort) ValidateParameters(parameters map[string]interface{}) error {
	if arraySize, ok := parameters["array_size"].(int); ok {
		if arraySize < 3 || arraySize > 100 {
			return fmt.Errorf("array_size must be between 3 and 100")
		}
	}
	return nil
}

// Helper function to generate random array
func generateRandomArray(size int) []int {
	arr := make([]int, size)
	for i := 0; i < size; i++ {
		arr[i] = i + 1
	}

	// Shuffle the array
	for i := len(arr) - 1; i > 0; i-- {
		j := i % (i + 1) // Simple shuffle for demo
		arr[i], arr[j] = arr[j], arr[i]
	}

	return arr
}

// Helper function to get int pointer
func intPtr(i int) *int {
	return &i
}
