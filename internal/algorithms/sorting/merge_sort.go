package sorting

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// MergeSort implements the merge sort algorithm
type MergeSort struct {
	metadata types.Algorithm
}

// NewMergeSort creates a new MergeSort instance
func NewMergeSort() *MergeSort {
	return &MergeSort{
		metadata: types.Algorithm{
			ID:          "merge_sort",
			Name:        "Merge Sort",
			Category:    types.CategorySorting,
			Description: "A divide-and-conquer algorithm that divides the array into two halves, sorts them separately, and then merges them back together.",
			BigO:        "Time: O(n log n), Space: O(n)",
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
					Name:        "show_divisions",
					Type:        "bool",
					Description: "Show division steps in visualization",
					Default:     true,
					Required:    false,
				},
			},
		},
	}
}

// GetMetadata returns the algorithm metadata
func (ms *MergeSort) GetMetadata() types.Algorithm {
	return ms.metadata
}

// Execute runs the merge sort algorithm
func (ms *MergeSort) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
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

	showDivisions := true
	if show, ok := parameters["show_divisions"].(bool); ok {
		showDivisions = show
	}

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"array":          arr,
			"show_divisions": showDivisions,
		},
		Message:   "Starting Merge Sort",
		Timestamp: time.Now(),
	})

	// Create a copy to avoid modifying the original
	sortedArr := make([]int, len(arr))
	copy(sortedArr, arr)

	// Perform merge sort
	ms.mergeSort(sortedArr, 0, len(sortedArr)-1, stepCallback, showDivisions, 1)

	// Send final result
	stepCallback(types.ExecutionStep{
		StepNumber: -1, // Final step
		Action:     "complete",
		Data: map[string]interface{}{
			"array":  sortedArr,
			"sorted": true,
		},
		Message:   "Merge Sort completed",
		Timestamp: time.Now(),
	})

	return sortedArr, nil
}

// mergeSort performs the recursive merge sort
func (ms *MergeSort) mergeSort(arr []int, left, right int, stepCallback func(types.ExecutionStep), showDivisions bool, stepNumber int) int {
	if left < right {
		mid := left + (right-left)/2

		if showDivisions {
			stepCallback(types.ExecutionStep{
				StepNumber: stepNumber,
				Action:     "divide",
				Data: map[string]interface{}{
					"array":       arr,
					"left":        left,
					"mid":         mid,
					"right":       right,
					"left_array":  arr[left : mid+1],
					"right_array": arr[mid+1 : right+1],
				},
				Message:   fmt.Sprintf("Dividing array from index %d to %d", left, right),
				Timestamp: time.Now(),
			})
			stepNumber++
		}

		// Recursively sort left and right halves
		stepNumber = ms.mergeSort(arr, left, mid, stepCallback, showDivisions, stepNumber)
		stepNumber = ms.mergeSort(arr, mid+1, right, stepCallback, showDivisions, stepNumber)

		// Merge the sorted halves
		stepCallback(types.ExecutionStep{
			StepNumber: stepNumber,
			Action:     "merge",
			Data: map[string]interface{}{
				"array":       arr,
				"left":        left,
				"mid":         mid,
				"right":       right,
				"left_array":  arr[left : mid+1],
				"right_array": arr[mid+1 : right+1],
			},
			Message:   fmt.Sprintf("Merging sorted halves from %d to %d", left, right),
			Timestamp: time.Now(),
		})
		stepNumber++

		ms.merge(arr, left, mid, right, stepCallback, stepNumber)
		stepNumber++
	}

	return stepNumber
}

// merge merges two sorted subarrays
func (ms *MergeSort) merge(arr []int, left, mid, right int, stepCallback func(types.ExecutionStep), stepNumber int) {
	// Create temporary arrays
	leftArr := make([]int, mid-left+1)
	rightArr := make([]int, right-mid)

	// Copy data to temporary arrays
	copy(leftArr, arr[left:mid+1])
	copy(rightArr, arr[mid+1:right+1])

	i, j, k := 0, 0, left

	// Merge the temporary arrays back into arr[left..right]
	for i < len(leftArr) && j < len(rightArr) {
		stepCallback(types.ExecutionStep{
			StepNumber: stepNumber,
			Action:     "compare_merge",
			Data: map[string]interface{}{
				"array":        arr,
				"left_value":   leftArr[i],
				"right_value":  rightArr[j],
				"left_index":   i,
				"right_index":  j,
				"target_index": k,
			},
			Message:   fmt.Sprintf("Comparing %d and %d for merge", leftArr[i], rightArr[j]),
			Timestamp: time.Now(),
		})
		stepNumber++

		if leftArr[i] <= rightArr[j] {
			arr[k] = leftArr[i]
			i++
		} else {
			arr[k] = rightArr[j]
			j++
		}
		k++
	}

	// Copy remaining elements
	for i < len(leftArr) {
		arr[k] = leftArr[i]
		i++
		k++
	}

	for j < len(rightArr) {
		arr[k] = rightArr[j]
		j++
		k++
	}
}

// ValidateParameters validates the input parameters
func (ms *MergeSort) ValidateParameters(parameters map[string]interface{}) error {
	if arraySize, ok := parameters["array_size"].(int); ok {
		if arraySize < 3 || arraySize > 100 {
			return fmt.Errorf("array_size must be between 3 and 100")
		}
	}
	return nil
}
