package searching

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// LinearSearch implements the linear search algorithm
type LinearSearch struct {
	metadata types.Algorithm
}

// NewLinearSearch creates a new LinearSearch instance
func NewLinearSearch() *LinearSearch {
	return &LinearSearch{
		metadata: types.Algorithm{
			ID:          "linear_search",
			Name:        "Linear Search",
			Category:    types.CategorySearching,
			Description: "A simple search algorithm that checks each element in the array sequentially until the target is found.",
			BigO:        "Time: O(n), Space: O(1)",
			Parameters: []types.Parameter{
				{
					Name:        "array_size",
					Type:        "int",
					Description: "Size of the array to search",
					Default:     10,
					Min:         intPtr(3),
					Max:         intPtr(100),
					Required:    true,
				},
				{
					Name:        "target",
					Type:        "int",
					Description: "Value to search for",
					Default:     5,
					Required:    true,
				},
			},
		},
	}
}

// GetMetadata returns the algorithm metadata
func (ls *LinearSearch) GetMetadata() types.Algorithm {
	return ls.metadata
}

// Execute runs the linear search algorithm
func (ls *LinearSearch) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
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

	target := 5
	if t, ok := parameters["target"].(int); ok {
		target = t
	}

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"array":  arr,
			"target": target,
		},
		Message:   fmt.Sprintf("Starting Linear Search for target: %d", target),
		Timestamp: time.Now(),
	})

	// Perform linear search
	for i := 0; i < len(arr); i++ {
		stepCallback(types.ExecutionStep{
			StepNumber: i + 1,
			Action:     "check_element",
			Data: map[string]interface{}{
				"array":     arr,
				"target":    target,
				"current":   arr[i],
				"index":     i,
				"checked":   arr[:i+1],
				"remaining": arr[i+1:],
			},
			Message:   fmt.Sprintf("Checking element %d at index %d", arr[i], i),
			Timestamp: time.Now(),
		})

		if arr[i] == target {
			stepCallback(types.ExecutionStep{
				StepNumber: i + 2,
				Action:     "found",
				Data: map[string]interface{}{
					"array":       arr,
					"target":      target,
					"found_at":    i,
					"value":       arr[i],
					"comparisons": i + 1,
				},
				Message:   fmt.Sprintf("Target %d found at index %d after %d comparisons", target, i, i+1),
				Timestamp: time.Now(),
			})

			return map[string]interface{}{
				"found":       true,
				"index":       i,
				"value":       arr[i],
				"comparisons": i + 1,
			}, nil
		}
	}

	// Target not found
	stepCallback(types.ExecutionStep{
		StepNumber: len(arr) + 1,
		Action:     "not_found",
		Data: map[string]interface{}{
			"array":       arr,
			"target":      target,
			"comparisons": len(arr),
		},
		Message:   fmt.Sprintf("Target %d not found after checking all %d elements", target, len(arr)),
		Timestamp: time.Now(),
	})

	return map[string]interface{}{
		"found":       false,
		"index":       -1,
		"value":       nil,
		"comparisons": len(arr),
	}, nil
}

// ValidateParameters validates the input parameters
func (ls *LinearSearch) ValidateParameters(parameters map[string]interface{}) error {
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
