package sorting

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// HeapSort implements the heap sort algorithm
type HeapSort struct {
	metadata types.Algorithm
}

// NewHeapSort creates a new HeapSort instance
func NewHeapSort() *HeapSort {
	return &HeapSort{
		metadata: types.Algorithm{
			ID:          "heap_sort",
			Name:        "Heap Sort",
			Category:    types.CategorySorting,
			Description: "A comparison-based sorting algorithm that uses a binary heap data structure to sort elements.",
			BigO:        "Time: O(n log n), Space: O(1)",
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
					Name:        "show_heap_structure",
					Type:        "bool",
					Description: "Show heap structure visualization",
					Default:     true,
					Required:    false,
				},
			},
		},
	}
}

// GetMetadata returns the algorithm metadata
func (hs *HeapSort) GetMetadata() types.Algorithm {
	return hs.metadata
}

// Execute runs the heap sort algorithm
func (hs *HeapSort) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
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

	showHeapStructure := true
	if show, ok := parameters["show_heap_structure"].(bool); ok {
		showHeapStructure = show
	}

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"array":               arr,
			"show_heap_structure": showHeapStructure,
		},
		Message:   "Starting Heap Sort",
		Timestamp: time.Now(),
	})

	// Create a copy to avoid modifying the original
	sortedArr := make([]int, len(arr))
	copy(sortedArr, arr)

	n := len(sortedArr)

	// Build max heap
	stepCallback(types.ExecutionStep{
		StepNumber: 1,
		Action:     "build_heap",
		Data: map[string]interface{}{
			"array": sortedArr,
			"phase": "building",
		},
		Message:   "Building max heap",
		Timestamp: time.Now(),
	})

	for i := n/2 - 1; i >= 0; i-- {
		hs.heapify(sortedArr, n, i, stepCallback, showHeapStructure, 2)
	}

	// Extract elements from heap one by one
	for i := n - 1; i > 0; i-- {
		// Move current root to end
		sortedArr[0], sortedArr[i] = sortedArr[i], sortedArr[0]

		stepCallback(types.ExecutionStep{
			StepNumber: -1, // Dynamic step number
			Action:     "extract_max",
			Data: map[string]interface{}{
				"array":     sortedArr,
				"extracted": sortedArr[i],
				"heap_size": i,
				"remaining": sortedArr[:i],
			},
			Message:   fmt.Sprintf("Extracted max element: %d", sortedArr[i]),
			Timestamp: time.Now(),
		})

		// Call max heapify on the reduced heap
		hs.heapify(sortedArr, i, 0, stepCallback, showHeapStructure, -1)
	}

	// Send final result
	stepCallback(types.ExecutionStep{
		StepNumber: -1, // Final step
		Action:     "complete",
		Data: map[string]interface{}{
			"array":  sortedArr,
			"sorted": true,
		},
		Message:   "Heap Sort completed",
		Timestamp: time.Now(),
	})

	return sortedArr, nil
}

// heapify maintains the heap property
func (hs *HeapSort) heapify(arr []int, n, i int, stepCallback func(types.ExecutionStep), showHeapStructure bool, stepNumber int) {
	largest := i
	left := 2*i + 1
	right := 2*i + 2

	if showHeapStructure {
		stepCallback(types.ExecutionStep{
			StepNumber: stepNumber,
			Action:     "heapify_check",
			Data: map[string]interface{}{
				"array":        arr,
				"parent":       i,
				"left_child":   left,
				"right_child":  right,
				"parent_value": arr[i],
				"heap_size":    n,
			},
			Message:   fmt.Sprintf("Checking heap property at index %d", i),
			Timestamp: time.Now(),
		})
	}

	// If left child is larger than root
	if left < n && arr[left] > arr[largest] {
		largest = left
	}

	// If right child is larger than largest so far
	if right < n && arr[right] > arr[largest] {
		largest = right
	}

	// If largest is not root
	if largest != i {
		arr[i], arr[largest] = arr[largest], arr[i]

		if showHeapStructure {
			stepCallback(types.ExecutionStep{
				StepNumber: stepNumber,
				Action:     "heapify_swap",
				Data: map[string]interface{}{
					"array":     arr,
					"swapped":   []int{i, largest},
					"parent":    i,
					"largest":   largest,
					"heap_size": n,
				},
				Message:   fmt.Sprintf("Swapped %d and %d to maintain heap property", arr[largest], arr[i]),
				Timestamp: time.Now(),
			})
		}

		// Recursively heapify the affected sub-tree
		hs.heapify(arr, n, largest, stepCallback, showHeapStructure, stepNumber)
	}
}

// ValidateParameters validates the input parameters
func (hs *HeapSort) ValidateParameters(parameters map[string]interface{}) error {
	if arraySize, ok := parameters["array_size"].(int); ok {
		if arraySize < 3 || arraySize > 100 {
			return fmt.Errorf("array_size must be between 3 and 100")
		}
	}
	return nil
}
