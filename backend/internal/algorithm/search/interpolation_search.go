package search

import (
	"context"
	"fmt"

	"algorthmia/backend/internal/models"
)

// InterpolationSearch implements the interpolation search algorithm
type InterpolationSearch struct {
	*BaseSearch
}

// NewInterpolationSearch creates a new interpolation search instance
func NewInterpolationSearch() *InterpolationSearch {
	metadata := models.Algorithm{
		ID:              "interpolation_search",
		Name:            "Interpolation Search",
		Type:            models.AlgorithmTypeSearch,
		Description:     "Searches for a target value in a uniformly distributed sorted array by estimating the position using interpolation formula",
		TimeComplexity:  "O(log log n)",
		SpaceComplexity: "O(1)",
		Category:        "search",
		Enabled:         true,
	}

	baseSearch := NewBaseSearch(metadata)
	return &InterpolationSearch{
		BaseSearch: baseSearch,
	}
}

// Execute runs the interpolation search algorithm
func (is *InterpolationSearch) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	if err := is.ValidateConfig(config); err != nil {
		return nil, err
	}

	// Prepare data (interpolation search requires sorted data)
	arr := is.PrepareData(config)
	target := is.GetTargetValue(config)
	n := len(arr)

	var steps []models.AlgorithmStep
	stepNumber := 1

	// Initial step showing the sorted array and target
	steps = append(steps, is.CreateStep(
		stepNumber,
		"Starting interpolation search",
		arr,
		[]int{},
		map[string]interface{}{
			"target":      target,
			"description": fmt.Sprintf("Looking for target %d using interpolation formula", target),
		},
	))
	stepNumber++

	left, right := 0, n-1

	// Interpolation search loop
	for left <= right && target >= arr[left] && target <= arr[right] {
		if err := is.CheckContextCancellation(ctx); err != nil {
			return nil, err
		}

		// Calculate interpolation position
		// pos = left + ((target - arr[left]) * (right - left)) / (arr[right] - arr[left])
		if arr[right] == arr[left] {
			// All elements are the same
			if arr[left] == target {
				steps = append(steps, is.CreateStep(
					stepNumber,
					"Target found",
					arr,
					[]int{left},
					map[string]interface{}{
						"target":      target,
						"found_index": left,
						"found_value": arr[left],
						"description": fmt.Sprintf("Found target %d at index %d", target, left),
					},
				))
				return steps, nil
			}
			break
		}

		pos := left + ((target-arr[left])*(right-left))/(arr[right]-arr[left])

		// Show the interpolation calculation
		steps = append(steps, is.CreateStep(
			stepNumber,
			"Calculating interpolation position",
			arr,
			[]int{left, right, pos},
			map[string]interface{}{
				"target":      target,
				"left":        left,
				"right":       right,
				"pos":         pos,
				"left_value":  arr[left],
				"right_value": arr[right],
				"pos_value":   arr[pos],
				"description": fmt.Sprintf("Interpolation: pos = %d + ((%d - %d) * (%d - %d)) / (%d - %d) = %d",
					left, target, arr[left], right, left, arr[right], arr[left], pos),
			},
		))
		stepNumber++

		// Check if target is found
		if arr[pos] == target {
			// Found the target - show final highlighting step
			steps = append(steps, is.CreateStep(
				stepNumber,
				"Target found!",
				arr,
				[]int{pos},
				map[string]interface{}{
					"target":         target,
					"found_index":    pos,
					"found_value":    arr[pos],
					"description":    fmt.Sprintf("🎯 Found target %d at interpolated index %d!", target, pos),
					"highlight_type": "found",
				},
			))
			stepNumber++

			// Add a final celebration step
			steps = append(steps, is.CreateStep(
				stepNumber,
				"Search complete",
				arr,
				[]int{pos},
				map[string]interface{}{
					"target":          target,
					"found_index":     pos,
					"found_value":     arr[pos],
					"description":     fmt.Sprintf("Interpolation search completed! Target %d found at position %d", target, pos),
					"highlight_type":  "found",
					"search_complete": true,
				},
			))
			return steps, nil
		}

		// Update search range
		if arr[pos] < target {
			// Target is in right half
			left = pos + 1
			steps = append(steps, is.CreateStep(
				stepNumber,
				"Target in right half",
				arr,
				[]int{left, right},
				map[string]interface{}{
					"target":      target,
					"left":        left,
					"right":       right,
					"pos_value":   arr[pos],
					"description": fmt.Sprintf("Target %d > %d, searching right half [%d:%d]", target, arr[pos], left, right),
				},
			))
		} else {
			// Target is in left half
			right = pos - 1
			steps = append(steps, is.CreateStep(
				stepNumber,
				"Target in left half",
				arr,
				[]int{left, right},
				map[string]interface{}{
					"target":      target,
					"left":        left,
					"right":       right,
					"pos_value":   arr[pos],
					"description": fmt.Sprintf("Target %d < %d, searching left half [%d:%d]", target, arr[pos], left, right),
				},
			))
		}
		stepNumber++
	}

	// Target not found
	steps = append(steps, is.CreateStep(
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

// ValidateConfig validates the configuration for interpolation search
func (is *InterpolationSearch) ValidateConfig(config models.AlgorithmConfig) error {
	if err := is.BaseSearch.ValidateConfig(config); err != nil {
		return err
	}

	// Interpolation search requires sorted data
	arr := is.PrepareData(config)
	if !isSorted(arr) {
		return fmt.Errorf("interpolation search requires sorted data")
	}

	return nil
}

// GetDefaultConfig returns default configuration for interpolation search
func (is *InterpolationSearch) GetDefaultConfig() models.AlgorithmConfig {
	config := is.BaseSearch.GetDefaultConfig()
	config.CustomParams["target"] = 42 // Default target
	return config
}
