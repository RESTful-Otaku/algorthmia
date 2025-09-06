package search

import (
	"context"
	"fmt"

	"algorthmia/backend/internal/models"
)

// LinearSearch implements the linear search algorithm
type LinearSearch struct {
	*BaseSearch
}

// NewLinearSearch creates a new linear search instance
func NewLinearSearch() *LinearSearch {
	metadata := models.Algorithm{
		ID:              "linear_search",
		Name:            "Linear Search",
		Type:            models.AlgorithmTypeSearch,
		Description:     "Searches for a target value by checking each element sequentially until found or the end is reached",
		TimeComplexity:  "O(n)",
		SpaceComplexity: "O(1)",
		Category:        "search",
		Enabled:         true,
	}

	baseSearch := NewBaseSearch(metadata)
	return &LinearSearch{
		BaseSearch: baseSearch,
	}
}

// Execute runs the linear search algorithm
func (ls *LinearSearch) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
	if err := ls.ValidateConfig(config); err != nil {
		return nil, err
	}

	// Prepare data (use provided data if available, otherwise generate unsorted data for linear search)
	arr := ls.PrepareData(config)
	target := ls.GetTargetValue(config)

	var steps []models.AlgorithmStep
	stepNumber := 1

	// Initial step showing the array and target
	steps = append(steps, ls.CreateStep(
		stepNumber,
		"Starting linear search",
		arr,
		[]int{},
		map[string]interface{}{
			"target":      target,
			"description": fmt.Sprintf("Looking for target value %d in the array", target),
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
		steps = append(steps, ls.CreateStep(
			stepNumber,
			"Target location",
			arr,
			[]int{targetIndex},
			map[string]interface{}{
				"target":         target,
				"target_index":   targetIndex,
				"description":    fmt.Sprintf("Target %d is at index %d", target, targetIndex),
				"highlight_type": "target",
			},
		))
		stepNumber++
	}

	// Track visited cells
	visitedCells := make([]int, 0)

	// Linear search through the array
	for i := 0; i < len(arr); i++ {
		if err := ls.CheckContextCancellation(ctx); err != nil {
			return nil, err
		}

		// Add current cell to visited
		visitedCells = append(visitedCells, i)

		// Create highlights: only current cell + target (if exists)
		highlights := make([]int, 0)
		highlights = append(highlights, i) // Only highlight current search cell
		if targetIndex >= 0 {
			highlights = append(highlights, targetIndex)
		}

		// Check if current element matches target
		if arr[i] == target {
			// Found the target - show final highlighting step
			steps = append(steps, ls.CreateStep(
				stepNumber,
				"Target found!",
				arr,
				highlights,
				map[string]interface{}{
					"target":         target,
					"found_index":    i,
					"found_value":    arr[i],
					"visited_cells":  visitedCells,
					"description":    fmt.Sprintf("🎯 Found target %d at index %d!", target, i),
					"highlight_type": "found",
				},
			))
			stepNumber++

			// Add a final celebration step
			steps = append(steps, ls.CreateStep(
				stepNumber,
				"Search complete",
				arr,
				highlights,
				map[string]interface{}{
					"target":          target,
					"found_index":     i,
					"found_value":     arr[i],
					"visited_cells":   visitedCells,
					"description":     fmt.Sprintf("Search completed successfully! Target %d found at position %d", target, i),
					"highlight_type":  "found",
					"search_complete": true,
				},
			))
			return steps, nil
		}

		// Current element is not the target
		steps = append(steps, ls.CreateStep(
			stepNumber,
			"Checking element",
			arr,
			highlights,
			map[string]interface{}{
				"target":         target,
				"current_index":  i,
				"current_value":  arr[i],
				"visited_cells":  visitedCells,
				"description":    fmt.Sprintf("Checking index %d: value %d (not the target)", i, arr[i]),
				"highlight_type": "searching",
			},
		))
		stepNumber++
	}

	// Target not found - show only target if it exists
	finalHighlights := make([]int, 0)
	if targetIndex >= 0 {
		finalHighlights = append(finalHighlights, targetIndex)
	}

	steps = append(steps, ls.CreateStep(
		stepNumber,
		"Target not found",
		arr,
		finalHighlights,
		map[string]interface{}{
			"target":        target,
			"visited_cells": visitedCells,
			"description":   fmt.Sprintf("Target %d not found in the array", target),
		},
	))

	return steps, nil
}

// ValidateConfig validates the configuration for linear search
func (ls *LinearSearch) ValidateConfig(config models.AlgorithmConfig) error {
	return ls.BaseSearch.ValidateConfig(config)
}

// PrepareData prepares data for linear search (generates unsorted data if not provided)
func (ls *LinearSearch) PrepareData(config models.AlgorithmConfig) []int {
	data := config.Data
	if len(data) == 0 {
		data = generateUnsortedData(config.ArraySize)
	}

	// Create a copy to avoid modifying the original
	arr := make([]int, len(data))
	copy(arr, data)
	return arr
}

// GetDefaultConfig returns default configuration for linear search
func (ls *LinearSearch) GetDefaultConfig() models.AlgorithmConfig {
	config := ls.BaseSearch.GetDefaultConfig()
	config.CustomParams["target"] = 42 // Default target
	return config
}
