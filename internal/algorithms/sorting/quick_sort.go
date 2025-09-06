package sorting

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// QuickSort implements the quick sort algorithm
type QuickSort struct {
	metadata types.Algorithm
}

// NewQuickSort creates a new QuickSort instance
func NewQuickSort() *QuickSort {
	return &QuickSort{
		metadata: types.Algorithm{
			ID:          "quick_sort",
			Name:        "Quick Sort",
			Category:    types.CategorySorting,
			Description: "A divide-and-conquer algorithm that picks a pivot element and partitions the array around the pivot.",
			BigO:        "Time: O(n log n) average, O(n²) worst case, Space: O(log n)",
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
					Name:        "pivot_strategy",
					Type:        "string",
					Description: "Pivot selection strategy",
					Default:     "middle",
					Required:    false,
				},
			},
		},
	}
}

// GetMetadata returns the algorithm metadata
func (qs *QuickSort) GetMetadata() types.Algorithm {
	return qs.metadata
}

// Execute runs the quick sort algorithm
func (qs *QuickSort) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
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

	pivotStrategy := "middle"
	if strategy, ok := parameters["pivot_strategy"].(string); ok {
		pivotStrategy = strategy
	}

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"array":          arr,
			"pivot_strategy": pivotStrategy,
		},
		Message:   "Starting Quick Sort",
		Timestamp: time.Now(),
	})

	// Create a copy to avoid modifying the original
	sortedArr := make([]int, len(arr))
	copy(sortedArr, arr)

	// Perform quick sort
	qs.quickSort(sortedArr, 0, len(sortedArr)-1, stepCallback, pivotStrategy, 1)

	// Send final result
	stepCallback(types.ExecutionStep{
		StepNumber: -1, // Final step
		Action:     "complete",
		Data: map[string]interface{}{
			"array":  sortedArr,
			"sorted": true,
		},
		Message:   "Quick Sort completed",
		Timestamp: time.Now(),
	})

	return sortedArr, nil
}

// quickSort performs the recursive quick sort
func (qs *QuickSort) quickSort(arr []int, low, high int, stepCallback func(types.ExecutionStep), pivotStrategy string, stepNumber int) int {
	if low < high {
		// Partition the array and get pivot index
		pivotIndex := qs.partition(arr, low, high, stepCallback, pivotStrategy, stepNumber)
		stepNumber++

		// Recursively sort elements before and after partition
		stepNumber = qs.quickSort(arr, low, pivotIndex-1, stepCallback, pivotStrategy, stepNumber)
		stepNumber = qs.quickSort(arr, pivotIndex+1, high, stepCallback, pivotStrategy, stepNumber)
	}

	return stepNumber
}

// partition partitions the array around a pivot
func (qs *QuickSort) partition(arr []int, low, high int, stepCallback func(types.ExecutionStep), pivotStrategy string, stepNumber int) int {
	// Choose pivot based on strategy
	var pivotIndex int
	switch pivotStrategy {
	case "first":
		pivotIndex = low
	case "last":
		pivotIndex = high
	case "middle":
		pivotIndex = low + (high-low)/2
	default:
		pivotIndex = low + (high-low)/2
	}

	pivot := arr[pivotIndex]

	stepCallback(types.ExecutionStep{
		StepNumber: stepNumber,
		Action:     "select_pivot",
		Data: map[string]interface{}{
			"array":       arr,
			"pivot_index": pivotIndex,
			"pivot_value": pivot,
			"low":         low,
			"high":        high,
		},
		Message:   fmt.Sprintf("Selected pivot: %d at index %d", pivot, pivotIndex),
		Timestamp: time.Now(),
	})
	stepNumber++

	// Move pivot to end
	arr[pivotIndex], arr[high] = arr[high], arr[pivotIndex]

	i := low - 1

	for j := low; j < high; j++ {
		stepCallback(types.ExecutionStep{
			StepNumber: stepNumber,
			Action:     "compare_pivot",
			Data: map[string]interface{}{
				"array":       arr,
				"pivot_value": pivot,
				"current":     arr[j],
				"j":           j,
				"i":           i,
			},
			Message:   fmt.Sprintf("Comparing %d with pivot %d", arr[j], pivot),
			Timestamp: time.Now(),
		})
		stepNumber++

		if arr[j] <= pivot {
			i++
			arr[i], arr[j] = arr[j], arr[i]

			stepCallback(types.ExecutionStep{
				StepNumber: stepNumber,
				Action:     "swap_partition",
				Data: map[string]interface{}{
					"array":       arr,
					"swapped":     []int{i, j},
					"pivot_value": pivot,
					"i":           i,
					"j":           j,
				},
				Message:   fmt.Sprintf("Swapped %d and %d", arr[j], arr[i]),
				Timestamp: time.Now(),
			})
			stepNumber++
		}
	}

	// Move pivot to its correct position
	arr[i+1], arr[high] = arr[high], arr[i+1]

	stepCallback(types.ExecutionStep{
		StepNumber: stepNumber,
		Action:     "pivot_positioned",
		Data: map[string]interface{}{
			"array":       arr,
			"pivot_index": i + 1,
			"pivot_value": pivot,
			"partitioned": true,
		},
		Message:   fmt.Sprintf("Pivot %d positioned at index %d", pivot, i+1),
		Timestamp: time.Now(),
	})

	return i + 1
}

// ValidateParameters validates the input parameters
func (qs *QuickSort) ValidateParameters(parameters map[string]interface{}) error {
	if arraySize, ok := parameters["array_size"].(int); ok {
		if arraySize < 3 || arraySize > 100 {
			return fmt.Errorf("array_size must be between 3 and 100")
		}
	}

	if strategy, ok := parameters["pivot_strategy"].(string); ok {
		validStrategies := []string{"first", "last", "middle"}
		valid := false
		for _, s := range validStrategies {
			if s == strategy {
				valid = true
				break
			}
		}
		if !valid {
			return fmt.Errorf("pivot_strategy must be one of: first, last, middle")
		}
	}

	return nil
}
