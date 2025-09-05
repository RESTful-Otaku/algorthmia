package sorting

import (
	"context"
	"fmt"
	"time"

	"algorthmia/backend/internal/models"
)

// InsertionSort implements the insertion sort algorithm
type InsertionSort struct {
	metadata models.Algorithm
}

// NewInsertionSort creates a new insertion sort algorithm instance
func NewInsertionSort() *InsertionSort {
	return &InsertionSort{
		metadata: models.Algorithm{
			ID:              "insertion_sort",
			Name:            "Insertion Sort",
			Type:            models.AlgorithmTypeSorting,
			Description:     "A simple sorting algorithm that builds the final sorted array one item at a time by inserting each element into its correct position.",
			TimeComplexity:  "O(n²)",
			SpaceComplexity: "O(1)",
			Category:        "Comparison Sort",
			Enabled:         true,
		},
	}
}

// Execute runs the insertion sort algorithm
func (is *InsertionSort) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	// Validate configuration
	if err := is.ValidateConfig(config); err != nil {
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
			"description": "Starting insertion sort algorithm",
			"array_size":  len(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)
	stepNumber++

	n := len(arr)

	for i := 1; i < n; i++ {
		// Check for context cancellation
		select {
		case <-ctx.Done():
			return steps, ctx.Err()
		default:
		}

		key := arr[i]
		j := i - 1

		// Add step showing current element to insert
		steps = append(steps, models.AlgorithmStep{
			StepNumber: stepNumber,
			Action:     "element_to_insert",
			Data:       make([]int, len(arr)),
			Highlights: []int{i},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Inserting element %d at position %d", key, i),
				"element":     i,
				"value":       key,
			},
			Timestamp: time.Now(),
		})
		copy(steps[stepNumber].Data, arr)
		stepNumber++

		// Move elements greater than key one position ahead
		for j >= 0 && arr[j] > key {
			// Check for context cancellation
			select {
			case <-ctx.Done():
				return steps, ctx.Err()
			default:
			}

			// Add step showing comparison
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "compare",
				Data:       make([]int, len(arr)),
				Highlights: []int{j, j + 1},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Comparing %d with %d", arr[j], key),
					"left":        j,
					"right":       j + 1,
					"left_value":  arr[j],
					"right_value": key,
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++

			// Add step showing shift
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "shift",
				Data:       make([]int, len(arr)),
				Highlights: []int{j, j + 1},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Shifting %d to position %d", arr[j], j+1),
					"from":        j,
					"to":          j + 1,
					"value":       arr[j],
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++

			// Perform the shift
			arr[j+1] = arr[j]
			j--

			// Add step showing after shift
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "shift_complete",
				Data:       make([]int, len(arr)),
				Highlights: []int{j + 1, j + 2},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Shifted %d to position %d", arr[j+1], j+1),
					"position":    j + 1,
					"value":       arr[j+1],
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++
		}

		// Insert key in its correct position
		if j+1 != i {
			// Add step showing insertion
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "insert",
				Data:       make([]int, len(arr)),
				Highlights: []int{j + 1},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Inserting %d at position %d", key, j+1),
					"position":    j + 1,
					"value":       key,
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++

			arr[j+1] = key

			// Add step showing after insertion
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "insert_complete",
				Data:       make([]int, len(arr)),
				Highlights: []int{j + 1},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("Inserted %d at position %d", key, j+1),
					"position":    j + 1,
					"value":       key,
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++
		} else {
			// Add step showing no insertion needed
			steps = append(steps, models.AlgorithmStep{
				StepNumber: stepNumber,
				Action:     "no_insert",
				Data:       make([]int, len(arr)),
				Highlights: []int{i},
				Metadata: map[string]interface{}{
					"description": fmt.Sprintf("No insertion needed: %d is already in correct position", key),
					"position":    i,
					"value":       key,
				},
				Timestamp: time.Now(),
			})
			copy(steps[stepNumber].Data, arr)
			stepNumber++
		}

		// Add step showing iteration complete
		steps = append(steps, models.AlgorithmStep{
			StepNumber: stepNumber,
			Action:     "iteration_complete",
			Data:       make([]int, len(arr)),
			Highlights: []int{},
			Metadata: map[string]interface{}{
				"description": fmt.Sprintf("Element %d is now in correct position", key),
				"element":     i,
				"sorted":      i + 1,
			},
			Timestamp: time.Now(),
		})
		copy(steps[stepNumber].Data, arr)
		stepNumber++
	}

	// Add final step with verification
	steps = append(steps, models.AlgorithmStep{
		StepNumber: stepNumber,
		Action:     "complete",
		Data:       make([]int, len(arr)),
		Highlights: []int{},
		Metadata: map[string]interface{}{
			"description": "Insertion sort completed",
			"total_steps": stepNumber + 1,
			"is_sorted":   isSorted(arr),
		},
		Timestamp: time.Now(),
	})
	copy(steps[stepNumber].Data, arr)

	return steps, nil
}

// GetMetadata returns algorithm metadata
func (is *InsertionSort) GetMetadata() models.Algorithm {
	return is.metadata
}

// ValidateConfig validates the configuration for insertion sort
func (is *InsertionSort) ValidateConfig(config models.AlgorithmConfig) error {
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

// GetDefaultConfig returns default configuration for insertion sort
func (is *InsertionSort) GetDefaultConfig() models.AlgorithmConfig {
	return models.AlgorithmConfig{
		ArraySize: 20,
		Speed:     5,
		Data:      []int{},
		CustomParams: map[string]interface{}{
			"show_comparisons": true,
			"show_shifts":      true,
		},
	}
}
