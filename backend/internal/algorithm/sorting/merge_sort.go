package sorting

import (
	"context"
	"fmt"
	"time"

	"algorthmia/backend/internal/models"
)

// MergeSort implements the merge sort algorithm
type MergeSort struct {
	metadata models.Algorithm
}

// NewMergeSort creates a new merge sort algorithm instance
func NewMergeSort() *MergeSort {
	return &MergeSort{
		metadata: models.Algorithm{
			ID:              "merge_sort",
			Name:            "Merge Sort",
			Type:            models.AlgorithmTypeSorting,
			Description:     "A divide-and-conquer algorithm that divides the array into two halves, sorts them separately, and then merges them back together.",
			TimeComplexity:  "O(n log n)",
			SpaceComplexity: "O(n)",
			Category:        "Comparison Sort",
			Enabled:         true,
		},
	}
}

// Execute runs the merge sort algorithm
func (ms *MergeSort) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	// Validate configuration
	if err := ms.ValidateConfig(config); err != nil {
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
			"description": "Starting merge sort algorithm",
			"array_size":  len(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)
	stepNumber++

	// Execute merge sort
	steps = ms.mergeSort(ctx, arr, 0, len(arr)-1, steps, &stepNumber)

	// Add final step with verification
	steps = append(steps, models.AlgorithmStep{
		StepNumber: stepNumber,
		Action:     "complete",
		Data:       make([]int, len(arr)),
		Highlights: []int{},
		Metadata: map[string]interface{}{
			"description": "Merge sort completed",
			"total_steps": stepNumber + 1,
			"is_sorted":   isSorted(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)

	return steps, nil
}

// mergeSort recursively sorts the array using divide and conquer
func (ms *MergeSort) mergeSort(ctx context.Context, arr []int, left, right int, steps []models.AlgorithmStep, stepNumber *int) []models.AlgorithmStep {
	// Check for context cancellation
	select {
	case <-ctx.Done():
		return steps
	default:
	}

	if left < right {
		mid := left + (right-left)/2

		// Add step showing division
		steps = append(steps, models.AlgorithmStep{
			StepNumber: *stepNumber,
			Action:     "divide",
			Data:       make([]int, len(arr)),
			Highlights: []int{left, mid, right},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Dividing array from %d to %d (mid: %d)", left, right, mid),
				"left":        left,
				"mid":         mid,
				"right":       right,
			},
			Timestamp: time.Now(),
		})
		copy(steps[*stepNumber].Data, arr)
		*stepNumber++

		// Sort first half
		steps = ms.mergeSort(ctx, arr, left, mid, steps, stepNumber)

		// Sort second half
		steps = ms.mergeSort(ctx, arr, mid+1, right, steps, stepNumber)

		// Merge the sorted halves
		steps = ms.merge(ctx, arr, left, mid, right, steps, stepNumber)
	}

	return steps
}

// merge merges two sorted subarrays
func (ms *MergeSort) merge(ctx context.Context, arr []int, left, mid, right int, steps []models.AlgorithmStep, stepNumber *int) []models.AlgorithmStep {
	// Check for context cancellation
	select {
	case <-ctx.Done():
		return steps
	default:
	}

	// Add step showing merge start
	steps = append(steps, models.AlgorithmStep{
		StepNumber: *stepNumber,
		Action:     "merge_start",
		Data:       make([]int, len(arr)),
		Highlights: []int{left, mid, right},
		Metadata: map[string]interface{}{
			"description": fmt.Sprintf("Merging subarrays from %d to %d and %d to %d", left, mid, mid+1, right),
			"left":        left,
			"mid":         mid,
			"right":       right,
		},
		Timestamp: time.Now(),
	})
	copy(steps[*stepNumber].Data, arr)
	*stepNumber++

	// Create temporary arrays
	n1 := mid - left + 1
	n2 := right - mid

	leftArr := make([]int, n1)
	rightArr := make([]int, n2)

	// Copy data to temporary arrays
	for i := 0; i < n1; i++ {
		leftArr[i] = arr[left+i]
	}
	for j := 0; j < n2; j++ {
		rightArr[j] = arr[mid+1+j]
	}

	// Merge the temporary arrays back
	i, j, k := 0, 0, left

	for i < n1 && j < n2 {
		// Check for context cancellation
		select {
		case <-ctx.Done():
			return steps
		default:
		}

		// Add step showing comparison
		steps = append(steps, models.AlgorithmStep{
			StepNumber: *stepNumber,
			Action:     "compare",
			Data:       make([]int, len(arr)),
			Highlights: []int{left + i, mid + 1 + j},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Comparing %d and %d", leftArr[i], rightArr[j]),
				"left_value":  leftArr[i],
				"right_value": rightArr[j],
				"left_index":  left + i,
				"right_index": mid + 1 + j,
			},
			Timestamp: time.Now(),
		})
		copy(steps[*stepNumber].Data, arr)
		*stepNumber++

		if leftArr[i] <= rightArr[j] {
			arr[k] = leftArr[i]
			i++

			// Add step showing element placement
			steps = append(steps, models.AlgorithmStep{
				StepNumber: *stepNumber,
				Action:     "place_element",
				Data:       make([]int, len(arr)),
				Highlights: []int{k},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Placed %d at position %d", arr[k], k),
					"position":    k,
					"value":       arr[k],
					"source":      "left",
				},
				Timestamp: time.Now(),
			})
			copy(steps[*stepNumber].Data, arr)
			*stepNumber++
		} else {
			arr[k] = rightArr[j]
			j++

			// Add step showing element placement
			steps = append(steps, models.AlgorithmStep{
				StepNumber: *stepNumber,
				Action:     "place_element",
				Data:       make([]int, len(arr)),
				Highlights: []int{k},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Placed %d at position %d", arr[k], k),
					"position":    k,
					"value":       arr[k],
					"source":      "right",
				},
				Timestamp: time.Now(),
			})
			copy(steps[*stepNumber].Data, arr)
			*stepNumber++
		}
		k++
	}

	// Copy remaining elements of leftArr
	for i < n1 {
		// Check for context cancellation
		select {
		case <-ctx.Done():
			return steps
		default:
		}

		arr[k] = leftArr[i]
		i++
		k++

		// Add step showing remaining element placement
		steps = append(steps, models.AlgorithmStep{
			StepNumber: *stepNumber,
			Action:     "place_remaining",
			Data:       make([]int, len(arr)),
			Highlights: []int{k - 1},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Placed remaining element %d at position %d", arr[k-1], k-1),
				"position":    k - 1,
				"value":       arr[k-1],
				"source":      "left_remaining",
			},
			Timestamp: time.Now(),
		})
		copy(steps[*stepNumber].Data, arr)
		*stepNumber++
	}

	// Copy remaining elements of rightArr
	for j < n2 {
		// Check for context cancellation
		select {
		case <-ctx.Done():
			return steps
		default:
		}

		arr[k] = rightArr[j]
		j++
		k++

		// Add step showing remaining element placement
		steps = append(steps, models.AlgorithmStep{
			StepNumber: *stepNumber,
			Action:     "place_remaining",
			Data:       make([]int, len(arr)),
			Highlights: []int{k - 1},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Placed remaining element %d at position %d", arr[k-1], k-1),
				"position":    k - 1,
				"value":       arr[k-1],
				"source":      "right_remaining",
			},
			Timestamp: time.Now(),
		})
		copy(steps[*stepNumber].Data, arr)
		*stepNumber++
	}

	// Add step showing merge complete
	steps = append(steps, models.AlgorithmStep{
		StepNumber: *stepNumber,
		Action:     "merge_complete",
		Data:       make([]int, len(arr)),
		Highlights: []int{left, right},
		Metadata: map[string]interface{}{
			"description": fmt.Sprintf("Merged subarrays from %d to %d", left, right),
			"left":        left,
			"right":       right,
		},
		Timestamp: time.Now(),
	})
	copy(steps[*stepNumber].Data, arr)
	*stepNumber++

	return steps
}

// GetMetadata returns algorithm metadata
func (ms *MergeSort) GetMetadata() models.Algorithm {
	return ms.metadata
}

// ValidateConfig validates the configuration for merge sort
func (ms *MergeSort) ValidateConfig(config models.AlgorithmConfig) error {
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

// GetDefaultConfig returns default configuration for merge sort
func (ms *MergeSort) GetDefaultConfig() models.AlgorithmConfig {
	return models.AlgorithmConfig{
		ArraySize: 20,
		Speed:     5,
		Data:      []int{},
		CustomParams: map[string]interface{}{
			"show_divisions": true,
			"show_merges":    true,
		},
	}
}
