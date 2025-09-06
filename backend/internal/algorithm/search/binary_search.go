package search

import (
	"context"
	"fmt"

	"algorthmia/backend/internal/models"
)

// BinarySearch implements the binary search algorithm
type BinarySearch struct {
	*BaseSearch
}

// NewBinarySearch creates a new binary search instance
func NewBinarySearch() *BinarySearch {
	metadata := models.Algorithm{
		ID:              "binary_search",
		Name:            "Binary Search",
		Type:            models.AlgorithmTypeSearch,
		Description:     "Searches for a target value in a sorted array by repeatedly dividing the search interval in half",
		TimeComplexity:  "O(log n)",
		SpaceComplexity: "O(1)",
		Category:        "search",
		Enabled:         true,
	}

	baseSearch := NewBaseSearch(metadata)
	return &BinarySearch{
		BaseSearch: baseSearch,
	}
}

// Execute runs the binary search algorithm
func (bs *BinarySearch) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	if err := bs.ValidateConfig(config); err != nil {
		return nil, err
	}

	// Prepare data (binary search requires sorted data)
	arr := bs.PrepareData(config)
	target := bs.GetTargetValue(config)

	var steps []models.AlgorithmStep
	stepNumber := 1

	// Initial step showing the sorted array and target
	steps = append(steps, bs.CreateStep(
		stepNumber,
		"Starting binary search",
		arr,
		[]int{},
		map[string]interface{}{
			"target":      target,
			"description": fmt.Sprintf("Looking for target value %d in sorted array", target),
		},
	))
	stepNumber++
	
	// Find and highlight the target value in the array (if it exists)
	targetIndex := -1
	for i, val := range arr {
		if val == target {
			targetIndex = i
			break
		}
	}
	
	if targetIndex >= 0 {
		// Highlight the target value
		steps = append(steps, bs.CreateStep(
			stepNumber,
			"Target location",
			arr,
			[]int{targetIndex},
			map[string]interface{}{
				"target":      target,
				"target_index": targetIndex,
				"description": fmt.Sprintf("Target %d is at index %d", target, targetIndex),
				"highlight_type": "target",
			},
		))
		stepNumber++
	}

	left, right := 0, len(arr)-1

	// Binary search loop
	for left <= right {
		if err := bs.CheckContextCancellation(ctx); err != nil {
			return nil, err
		}

		// Calculate middle index
		mid := left + (right-left)/2

		// Show the current search range
		highlights := []int{mid}
		if left != mid {
			highlights = append(highlights, left)
		}
		if right != mid {
			highlights = append(highlights, right)
		}

		steps = append(steps, bs.CreateStep(
			stepNumber,
			"Checking middle element",
			arr,
			highlights,
			map[string]interface{}{
				"target":      target,
				"left":        left,
				"right":       right,
				"mid":         mid,
				"mid_value":   arr[mid],
				"description": fmt.Sprintf("Checking middle index %d: value %d", mid, arr[mid]),
				"highlight_type": "searching",
			},
		))
		stepNumber++

		// Check if target is found
		if arr[mid] == target {
			// Found the target - show final highlighting step
			steps = append(steps, bs.CreateStep(
				stepNumber,
				"Target found!",
				arr,
				[]int{mid},
				map[string]interface{}{
					"target":         target,
					"found_index":    mid,
					"found_value":    arr[mid],
					"description":    fmt.Sprintf("🎯 Found target %d at index %d!", target, mid),
					"highlight_type": "found",
				},
			))
			stepNumber++

			// Add a final celebration step
			steps = append(steps, bs.CreateStep(
				stepNumber,
				"Search complete",
				arr,
				[]int{mid},
				map[string]interface{}{
					"target":          target,
					"found_index":     mid,
					"found_value":     arr[mid],
					"description":     fmt.Sprintf("Binary search completed! Target %d found at position %d", target, mid),
					"highlight_type":  "found",
					"search_complete": true,
				},
			))
			return steps, nil
		}

		// Update search range
		if arr[mid] < target {
			// Target is in right half
			left = mid + 1
			steps = append(steps, bs.CreateStep(
				stepNumber,
				"Target in right half",
				arr,
				[]int{left, right},
				map[string]interface{}{
					"target":      target,
					"left":        left,
					"right":       right,
					"mid_value":   arr[mid],
					"description": fmt.Sprintf("Target %d > %d, searching right half [%d:%d]", target, arr[mid], left, right),
				},
			))
		} else {
			// Target is in left half
			right = mid - 1
			steps = append(steps, bs.CreateStep(
				stepNumber,
				"Target in left half",
				arr,
				[]int{left, right},
				map[string]interface{}{
					"target":      target,
					"left":        left,
					"right":       right,
					"mid_value":   arr[mid],
					"description": fmt.Sprintf("Target %d < %d, searching left half [%d:%d]", target, arr[mid], left, right),
				},
			))
		}
		stepNumber++
	}

	// Target not found
	steps = append(steps, bs.CreateStep(
		stepNumber,
		"Target not found",
		arr,
		[]int{},
		map[string]interface{}{
			"target":      target,
			"description": fmt.Sprintf("Target %d not found in the array", target),
		},
	))

	return steps, nil
}

// ValidateConfig validates the configuration for binary search
func (bs *BinarySearch) ValidateConfig(config models.AlgorithmConfig) error {
	if err := bs.BaseSearch.ValidateConfig(config); err != nil {
		return err
	}

	// Binary search requires sorted data
	arr := bs.PrepareData(config)
	if !isSorted(arr) {
		return fmt.Errorf("binary search requires sorted data")
	}

	return nil
}

// GetDefaultConfig returns default configuration for binary search
func (bs *BinarySearch) GetDefaultConfig() models.AlgorithmConfig {
	config := bs.BaseSearch.GetDefaultConfig()
	config.CustomParams["target"] = 42 // Default target
	return config
}
