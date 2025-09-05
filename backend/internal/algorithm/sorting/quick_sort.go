package sorting

import (
	"context"
	"fmt"
	"time"

	"algorthmia/backend/internal/models"
)

// QuickSort implements the quick sort algorithm
type QuickSort struct {
	metadata models.Algorithm
}

// NewQuickSort creates a new quick sort algorithm instance
func NewQuickSort() *QuickSort {
	return &QuickSort{
		metadata: models.Algorithm{
			ID:              "quick_sort",
			Name:            "Quick Sort",
			Type:            models.AlgorithmTypeSorting,
			Description:     "A divide-and-conquer algorithm that picks a pivot element and partitions the array around the pivot, then recursively sorts the subarrays.",
			TimeComplexity:  "O(n log n) average, O(n²) worst",
			SpaceComplexity: "O(log n)",
			Category:        "Comparison Sort",
			Enabled:         true,
		},
	}
}

// Execute runs the quick sort algorithm
func (qs *QuickSort) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	// Validate configuration
	if err := qs.ValidateConfig(config); err != nil {
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
			"description": "Starting quick sort algorithm",
			"array_size":  len(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)
	stepNumber++

	// Execute quick sort
	steps = qs.quickSort(ctx, arr, 0, len(arr)-1, steps, &stepNumber)

	// Add final step with verification
	steps = append(steps, models.AlgorithmStep{
		StepNumber: stepNumber,
		Action:     "complete",
		Data:       make([]int, len(arr)),
		Highlights: []int{},
		Metadata: map[string]interface{}{
			"description": "Quick sort completed",
			"total_steps": stepNumber + 1,
			"is_sorted":   isSorted(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)

	return steps, nil
}

// quickSort recursively sorts the array using divide and conquer
func (qs *QuickSort) quickSort(ctx context.Context, arr []int, low, high int, steps []models.AlgorithmStep, stepNumber *int) []models.AlgorithmStep {
	// Check for context cancellation
	select {
	case <-ctx.Done():
		return steps
	default:
	}

	if low < high {
		// Add step showing partition start
		steps = append(steps, models.AlgorithmStep{
			StepNumber: *stepNumber,
			Action:     "partition_start",
			Data:       make([]int, len(arr)),
			Highlights: []int{low, high},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Partitioning array from %d to %d", low, high),
				"low":         low,
				"high":        high,
			},
			Timestamp: time.Now(),
		})
		copy(steps[*stepNumber].Data, arr)
		*stepNumber++

		// Partition the array and get pivot index
		pivotIndex := qs.partition(ctx, arr, low, high, steps, stepNumber)

		// Add step showing partition complete
		steps = append(steps, models.AlgorithmStep{
			StepNumber: *stepNumber,
			Action:     "partition_complete",
			Data:       make([]int, len(arr)),
			Highlights: []int{pivotIndex},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Partition complete. Pivot %d is at position %d", arr[pivotIndex], pivotIndex),
				"pivot_index": pivotIndex,
				"pivot_value": arr[pivotIndex],
			},
			Timestamp: time.Now(),
		})
		copy(steps[*stepNumber].Data, arr)
		*stepNumber++

		// Recursively sort elements before and after partition
		steps = qs.quickSort(ctx, arr, low, pivotIndex-1, steps, stepNumber)
		steps = qs.quickSort(ctx, arr, pivotIndex+1, high, steps, stepNumber)
	}

	return steps
}

// partition partitions the array around a pivot element
func (qs *QuickSort) partition(ctx context.Context, arr []int, low, high int, steps []models.AlgorithmStep, stepNumber *int) int {
	// Check for context cancellation
	select {
	case <-ctx.Done():
		return low
	default:
	}

	// Choose the rightmost element as pivot
	pivot := arr[high]
	pivotIndex := low

	// Add step showing pivot selection
	steps = append(steps, models.AlgorithmStep{
		StepNumber: *stepNumber,
		Action:     "pivot_select",
		Data:       make([]int, len(arr)),
		Highlights: []int{high},
		Metadata: map[string]interface{}{
			"description": fmt.Sprintf("Selected pivot: %d at position %d", pivot, high),
			"pivot":       high,
			"pivot_value": pivot,
		},
		Timestamp: time.Now(),
	})
	copy(steps[*stepNumber].Data, arr)
	*stepNumber++

	for j := low; j < high; j++ {
		// Check for context cancellation
		select {
		case <-ctx.Done():
			return pivotIndex
		default:
		}

		// Add step showing comparison
		steps = append(steps, models.AlgorithmStep{
			StepNumber: *stepNumber,
			Action:     "compare",
			Data:       make([]int, len(arr)),
			Highlights: []int{j, high},
			Metadata: map[string]interface{}{
				"description":   fmt.Sprintf("Comparing %d with pivot %d", arr[j], pivot),
				"element":       j,
				"pivot":         high,
				"element_value": arr[j],
				"pivot_value":   pivot,
			},
			Timestamp: time.Now(),
		})
		copy(steps[*stepNumber].Data, arr)
		*stepNumber++

		if arr[j] < pivot {
			// Add step showing swap
			steps = append(steps, models.AlgorithmStep{
				StepNumber: *stepNumber,
				Action:     "swap",
				Data:       make([]int, len(arr)),
				Highlights: []int{pivotIndex, j},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Swapping %d and %d", arr[pivotIndex], arr[j]),
					"from":        pivotIndex,
					"to":          j,
					"from_value":  arr[pivotIndex],
					"to_value":    arr[j],
				},
				Timestamp: time.Now(),
			})
			copy(steps[*stepNumber].Data, arr)
			*stepNumber++

			// Perform the swap
			arr[pivotIndex], arr[j] = arr[j], arr[pivotIndex]

			// Add step showing after swap
			steps = append(steps, models.AlgorithmStep{
				StepNumber: *stepNumber,
				Action:     "swap_complete",
				Data:       make([]int, len(arr)),
				Highlights: []int{pivotIndex, j},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Swapped: %d is now at position %d", arr[j], pivotIndex),
					"position":    pivotIndex,
					"value":       arr[pivotIndex],
				},
				Timestamp: time.Now(),
			})
			copy(steps[*stepNumber].Data, arr)
			*stepNumber++

			pivotIndex++
		} else {
			// Add step showing no swap
			steps = append(steps, models.AlgorithmStep{
				StepNumber: *stepNumber,
				Action:     "no_swap",
				Data:       make([]int, len(arr)),
				Highlights: []int{j, high},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("No swap: %d >= pivot %d", arr[j], pivot),
					"element":     j,
					"pivot":       high,
				},
				Timestamp: time.Now(),
			})
			copy(steps[*stepNumber].Data, arr)
			*stepNumber++
		}
	}

	// Place pivot in correct position
	// Add step showing final pivot placement
	steps = append(steps, models.AlgorithmStep{
		StepNumber: *stepNumber,
		Action:     "pivot_place",
		Data:       make([]int, len(arr)),
		Highlights: []int{pivotIndex, high},
		Metadata: map[string]interface{}{
			"description": fmt.Sprintf("Placing pivot %d at position %d", pivot, pivotIndex),
			"pivot":       high,
			"position":    pivotIndex,
			"pivot_value": pivot,
		},
		Timestamp: time.Now(),
	})
	copy(steps[*stepNumber].Data, arr)
	*stepNumber++

	arr[pivotIndex], arr[high] = arr[high], arr[pivotIndex]

	// Add step showing pivot placed
	steps = append(steps, models.AlgorithmStep{
		StepNumber: *stepNumber,
		Action:     "pivot_placed",
		Data:       make([]int, len(arr)),
		Highlights: []int{pivotIndex},
		Metadata: map[string]interface{}{
			"description": fmt.Sprintf("Pivot %d placed at position %d", pivot, pivotIndex),
			"pivot":       pivotIndex,
			"pivot_value": pivot,
		},
		Timestamp: time.Now(),
	})
	copy(steps[*stepNumber].Data, arr)
	*stepNumber++

	return pivotIndex
}

// GetMetadata returns algorithm metadata
func (qs *QuickSort) GetMetadata() models.Algorithm {
	return qs.metadata
}

// ValidateConfig validates the configuration for quick sort
func (qs *QuickSort) ValidateConfig(config models.AlgorithmConfig) error {
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

// GetDefaultConfig returns default configuration for quick sort
func (qs *QuickSort) GetDefaultConfig() models.AlgorithmConfig {
	return models.AlgorithmConfig{
		ArraySize: 20,
		Speed:     5,
		Data:      []int{},
		CustomParams: map[string]interface{}{
			"show_partitions": true,
			"show_pivots":     true,
		},
	}
}
