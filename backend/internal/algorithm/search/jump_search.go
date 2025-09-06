package search

import (
	"context"
	"fmt"
	"math"

	"algorthmia/backend/internal/models"
)

// JumpSearch implements the jump search algorithm
type JumpSearch struct {
	*BaseSearch
}

// NewJumpSearch creates a new jump search instance
func NewJumpSearch() *JumpSearch {
	metadata := models.Algorithm{
		ID:              "jump_search",
		Name:            "Jump Search",
		Type:            models.AlgorithmTypeSearch,
		Description:     "Searches for a target value in a sorted array by jumping ahead by fixed steps and then performing linear search backwards",
		TimeComplexity:  "O(√n)",
		SpaceComplexity: "O(1)",
		Category:        "search",
		Enabled:         true,
	}

	baseSearch := NewBaseSearch(metadata)
	return &JumpSearch{
		BaseSearch: baseSearch,
	}
}

// Execute runs the jump search algorithm
func (js *JumpSearch) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	if err := js.ValidateConfig(config); err != nil {
		return nil, err
	}

	// Prepare data (jump search requires sorted data)
	arr := js.PrepareData(config)
	target := js.GetTargetValue(config)
	n := len(arr)
	jumpSize := int(math.Sqrt(float64(n)))

	var steps []models.AlgorithmStep
	stepNumber := 1

	// Initial step showing the sorted array and target
	steps = append(steps, js.CreateStep(
		stepNumber,
		"Starting jump search",
		arr,
		[]int{},
		map[string]interface{}{
			"target":      target,
			"jump_size":   jumpSize,
			"description": fmt.Sprintf("Looking for target %d, jump size: %d", target, jumpSize),
		},
	))
	stepNumber++

	prev := 0
	current := jumpSize

	// Jump ahead until we find a block that might contain the target
	for current < n && arr[current] < target {
		if err := js.CheckContextCancellation(ctx); err != nil {
			return nil, err
		}

		steps = append(steps, js.CreateStep(
			stepNumber,
			"Jumping ahead",
			arr,
			[]int{prev, current},
			map[string]interface{}{
				"target":        target,
				"prev":          prev,
				"current":       current,
				"current_value": arr[current],
				"description":   fmt.Sprintf("Jump to index %d: value %d < target %d, continue jumping", current, arr[current], target),
			},
		))
		stepNumber++

		prev = current
		current += jumpSize
	}

	// Ensure we don't go beyond array bounds
	if current >= n {
		current = n - 1
	}

	// Show the final jump position
	steps = append(steps, js.CreateStep(
		stepNumber,
		"Found potential block",
		arr,
		[]int{prev, current},
		map[string]interface{}{
			"target":        target,
			"prev":          prev,
			"current":       current,
			"current_value": arr[current],
			"description":   fmt.Sprintf("Jump to index %d: value %d >= target %d, search in block [%d:%d]", current, arr[current], target, prev, current),
		},
	))
	stepNumber++

	// Linear search backwards in the identified block
	for i := current; i >= prev; i-- {
		if err := js.CheckContextCancellation(ctx); err != nil {
			return nil, err
		}

		steps = append(steps, js.CreateStep(
			stepNumber,
			"Linear search in block",
			arr,
			[]int{i},
			map[string]interface{}{
				"target":      target,
				"index":       i,
				"value":       arr[i],
				"description": fmt.Sprintf("Checking index %d: value %d", i, arr[i]),
			},
		))
		stepNumber++

		if arr[i] == target {
			// Found the target - show final highlighting step
			steps = append(steps, js.CreateStep(
				stepNumber,
				"Target found!",
				arr,
				[]int{i},
				map[string]interface{}{
					"target":         target,
					"found_index":    i,
					"found_value":    arr[i],
					"description":    fmt.Sprintf("🎯 Found target %d at index %d!", target, i),
					"highlight_type": "found",
				},
			))
			stepNumber++

			// Add a final celebration step
			steps = append(steps, js.CreateStep(
				stepNumber,
				"Search complete",
				arr,
				[]int{i},
				map[string]interface{}{
					"target":          target,
					"found_index":     i,
					"found_value":     arr[i],
					"description":     fmt.Sprintf("Jump search completed! Target %d found at position %d", target, i),
					"highlight_type":  "found",
					"search_complete": true,
				},
			))
			return steps, nil
		}
	}

	// Target not found
	steps = append(steps, js.CreateStep(
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

// ValidateConfig validates the configuration for jump search
func (js *JumpSearch) ValidateConfig(config models.AlgorithmConfig) error {
	if err := js.BaseSearch.ValidateConfig(config); err != nil {
		return err
	}

	// Jump search requires sorted data
	arr := js.PrepareData(config)
	if !isSorted(arr) {
		return fmt.Errorf("jump search requires sorted data")
	}

	return nil
}

// GetDefaultConfig returns default configuration for jump search
func (js *JumpSearch) GetDefaultConfig() models.AlgorithmConfig {
	config := js.BaseSearch.GetDefaultConfig()
	config.CustomParams["target"] = 42 // Default target
	return config
}
