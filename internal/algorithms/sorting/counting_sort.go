package sorting

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// CountingSort implements the counting sort algorithm
type CountingSort struct {
	metadata types.Algorithm
}

// NewCountingSort creates a new CountingSort instance
func NewCountingSort() *CountingSort {
	return &CountingSort{
		metadata: types.Algorithm{
			ID:          "counting_sort",
			Name:        "Counting Sort",
			Category:    types.CategorySorting,
			Description: "A non-comparison-based sorting algorithm that counts the number of objects having distinct key values.",
			BigO:        "Time: O(n + k), Space: O(k) where k is the range of input",
			Parameters: []types.Parameter{
				{
					Name:        "array_size",
					Type:        "int",
					Description: "Size of the array to sort",
					Default:     10,
					Min:         intPtr(3),
					Max:         intPtr(50),
					Required:    true,
				},
				{
					Name:        "max_value",
					Type:        "int",
					Description: "Maximum value in the array",
					Default:     20,
					Min:         intPtr(5),
					Max:         intPtr(100),
					Required:    true,
				},
			},
		},
	}
}

// GetMetadata returns the algorithm metadata
func (cs *CountingSort) GetMetadata() types.Algorithm {
	return cs.metadata
}

// Execute runs the counting sort algorithm
func (cs *CountingSort) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
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
		maxValue := 20
		if max, ok := parameters["max_value"].(int); ok {
			maxValue = max
		}
		arr = generateRandomArrayWithMax(arraySize, maxValue)
	}

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"array": arr,
		},
		Message:   "Starting Counting Sort",
		Timestamp: time.Now(),
	})

	// Find the maximum element
	max := arr[0]
	for _, v := range arr {
		if v > max {
			max = v
		}
	}

	stepCallback(types.ExecutionStep{
		StepNumber: 1,
		Action:     "find_max",
		Data: map[string]interface{}{
			"array":     arr,
			"max_value": max,
		},
		Message:   fmt.Sprintf("Found maximum value: %d", max),
		Timestamp: time.Now(),
	})

	// Create count array
	count := make([]int, max+1)
	output := make([]int, len(arr))

	// Count occurrences
	stepCallback(types.ExecutionStep{
		StepNumber: 2,
		Action:     "count_occurrences",
		Data: map[string]interface{}{
			"array":       arr,
			"count_array": count,
			"phase":       "counting",
		},
		Message:   "Counting occurrences of each element",
		Timestamp: time.Now(),
	})

	for i := 0; i < len(arr); i++ {
		count[arr[i]]++

		stepCallback(types.ExecutionStep{
			StepNumber: 3 + i,
			Action:     "count_element",
			Data: map[string]interface{}{
				"array":       arr,
				"count_array": count,
				"element":     arr[i],
				"index":       i,
			},
			Message:   fmt.Sprintf("Counted element %d, count now: %d", arr[i], count[arr[i]]),
			Timestamp: time.Now(),
		})
	}

	// Modify count array to store actual position
	stepCallback(types.ExecutionStep{
		StepNumber: 3 + len(arr),
		Action:     "modify_count",
		Data: map[string]interface{}{
			"array":       arr,
			"count_array": count,
			"phase":       "modifying",
		},
		Message:   "Modifying count array to store positions",
		Timestamp: time.Now(),
	})

	for i := 1; i <= max; i++ {
		count[i] += count[i-1]

		stepCallback(types.ExecutionStep{
			StepNumber: 4 + len(arr) + i,
			Action:     "modify_count_element",
			Data: map[string]interface{}{
				"array":       arr,
				"count_array": count,
				"value":       i,
				"new_count":   count[i],
			},
			Message:   fmt.Sprintf("Updated count for value %d to position %d", i, count[i]),
			Timestamp: time.Now(),
		})
	}

	// Build output array
	stepCallback(types.ExecutionStep{
		StepNumber: 4 + len(arr) + max + 1,
		Action:     "build_output",
		Data: map[string]interface{}{
			"array":       arr,
			"count_array": count,
			"output":      output,
			"phase":       "building",
		},
		Message:   "Building output array",
		Timestamp: time.Now(),
	})

	for i := len(arr) - 1; i >= 0; i-- {
		output[count[arr[i]]-1] = arr[i]
		count[arr[i]]--

		stepCallback(types.ExecutionStep{
			StepNumber: 5 + len(arr) + max + (len(arr) - i),
			Action:     "place_element",
			Data: map[string]interface{}{
				"array":       arr,
				"count_array": count,
				"output":      output,
				"element":     arr[i],
				"position":    count[arr[i]],
			},
			Message:   fmt.Sprintf("Placed element %d at position %d", arr[i], count[arr[i]]),
			Timestamp: time.Now(),
		})
	}

	// Send final result
	stepCallback(types.ExecutionStep{
		StepNumber: -1, // Final step
		Action:     "complete",
		Data: map[string]interface{}{
			"array":  output,
			"sorted": true,
		},
		Message:   "Counting Sort completed",
		Timestamp: time.Now(),
	})

	return output, nil
}

// ValidateParameters validates the input parameters
func (cs *CountingSort) ValidateParameters(parameters map[string]interface{}) error {
	if arraySize, ok := parameters["array_size"].(int); ok {
		if arraySize < 3 || arraySize > 50 {
			return fmt.Errorf("array_size must be between 3 and 50")
		}
	}

	if maxValue, ok := parameters["max_value"].(int); ok {
		if maxValue < 5 || maxValue > 100 {
			return fmt.Errorf("max_value must be between 5 and 100")
		}
	}

	return nil
}

// Helper function to generate random array with max value
func generateRandomArrayWithMax(size, maxValue int) []int {
	arr := make([]int, size)
	for i := 0; i < size; i++ {
		arr[i] = (i % maxValue) + 1
	}

	// Shuffle the array
	for i := len(arr) - 1; i > 0; i-- {
		j := i % (i + 1) // Simple shuffle for demo
		arr[i], arr[j] = arr[j], arr[i]
	}

	return arr
}
