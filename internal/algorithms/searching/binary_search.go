package searching

import (
	"algorthmia/internal/types"
	"fmt"
	"sort"
	"time"
)

// BinarySearch implements the binary search algorithm
type BinarySearch struct {
	metadata types.Algorithm
}

// NewBinarySearch creates a new BinarySearch instance
func NewBinarySearch() *BinarySearch {
	return &BinarySearch{
		metadata: types.Algorithm{
			ID:          "binary_search",
			Name:        "Binary Search",
			Category:    types.CategorySearching,
			Description: "A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
			BigO:        "Time: O(log n), Space: O(1)",
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
func (bs *BinarySearch) GetMetadata() types.Algorithm {
	return bs.metadata
}

// Execute runs the binary search algorithm
func (bs *BinarySearch) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
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

	// Sort the array first
	sort.Ints(arr)

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"array":  arr,
			"target": target,
		},
		Message:   fmt.Sprintf("Starting Binary Search for target: %d in sorted array", target),
		Timestamp: time.Now(),
	})

	left, right := 0, len(arr)-1
	comparisons := 0

	for left <= right {
		mid := left + (right-left)/2
		comparisons++

		stepCallback(types.ExecutionStep{
			StepNumber: comparisons,
			Action:     "check_middle",
			Data: map[string]interface{}{
				"array":       arr,
				"target":      target,
				"left":        left,
				"right":       right,
				"mid":         mid,
				"mid_value":   arr[mid],
				"comparisons": comparisons,
			},
			Message:   fmt.Sprintf("Checking middle element %d at index %d", arr[mid], mid),
			Timestamp: time.Now(),
		})

		if arr[mid] == target {
			stepCallback(types.ExecutionStep{
				StepNumber: comparisons + 1,
				Action:     "found",
				Data: map[string]interface{}{
					"array":       arr,
					"target":      target,
					"found_at":    mid,
					"value":       arr[mid],
					"comparisons": comparisons,
				},
				Message:   fmt.Sprintf("Target %d found at index %d after %d comparisons", target, mid, comparisons),
				Timestamp: time.Now(),
			})

			return map[string]interface{}{
				"found":       true,
				"index":       mid,
				"value":       arr[mid],
				"comparisons": comparisons,
			}, nil
		}

		if arr[mid] < target {
			left = mid + 1
			stepCallback(types.ExecutionStep{
				StepNumber: comparisons + 1,
				Action:     "search_right",
				Data: map[string]interface{}{
					"array":       arr,
					"target":      target,
					"left":        left,
					"right":       right,
					"mid":         mid,
					"comparisons": comparisons,
				},
				Message:   fmt.Sprintf("Target is greater than %d, searching right half", arr[mid]),
				Timestamp: time.Now(),
			})
		} else {
			right = mid - 1
			stepCallback(types.ExecutionStep{
				StepNumber: comparisons + 1,
				Action:     "search_left",
				Data: map[string]interface{}{
					"array":       arr,
					"target":      target,
					"left":        left,
					"right":       right,
					"mid":         mid,
					"comparisons": comparisons,
				},
				Message:   fmt.Sprintf("Target is less than %d, searching left half", arr[mid]),
				Timestamp: time.Now(),
			})
		}
	}

	// Target not found
	stepCallback(types.ExecutionStep{
		StepNumber: comparisons + 1,
		Action:     "not_found",
		Data: map[string]interface{}{
			"array":       arr,
			"target":      target,
			"comparisons": comparisons,
		},
		Message:   fmt.Sprintf("Target %d not found after %d comparisons", target, comparisons),
		Timestamp: time.Now(),
	})

	return map[string]interface{}{
		"found":       false,
		"index":       -1,
		"value":       nil,
		"comparisons": comparisons,
	}, nil
}

// ValidateParameters validates the input parameters
func (bs *BinarySearch) ValidateParameters(parameters map[string]interface{}) error {
	if arraySize, ok := parameters["array_size"].(int); ok {
		if arraySize < 3 || arraySize > 100 {
			return fmt.Errorf("array_size must be between 3 and 100")
		}
	}
	return nil
}
