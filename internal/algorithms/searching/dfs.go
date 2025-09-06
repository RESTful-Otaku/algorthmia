package searching

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// DFS implements the depth-first search algorithm
type DFS struct {
	metadata types.Algorithm
}

// NewDFS creates a new DFS instance
func NewDFS() *DFS {
	return &DFS{
		metadata: types.Algorithm{
			ID:          "dfs",
			Name:        "Depth-First Search",
			Category:    types.CategorySearching,
			Description: "A graph traversal algorithm that explores as far as possible along each branch before backtracking.",
			BigO:        "Time: O(V + E), Space: O(V) where V is vertices and E is edges",
			Parameters: []types.Parameter{
				{
					Name:        "graph_size",
					Type:        "int",
					Description: "Number of nodes in the graph",
					Default:     6,
					Min:         intPtr(3),
					Max:         intPtr(20),
					Required:    true,
				},
				{
					Name:        "start_node",
					Type:        "int",
					Description: "Starting node for DFS",
					Default:     0,
					Min:         intPtr(0),
					Max:         intPtr(19),
					Required:    true,
				},
				{
					Name:        "target_node",
					Type:        "int",
					Description: "Target node to find",
					Default:     5,
					Min:         intPtr(0),
					Max:         intPtr(19),
					Required:    true,
				},
			},
		},
	}
}

// GetMetadata returns the algorithm metadata
func (dfs *DFS) GetMetadata() types.Algorithm {
	return dfs.metadata
}

// Execute runs the DFS algorithm
func (dfs *DFS) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
	graphSize := 6
	if size, ok := parameters["graph_size"].(int); ok {
		graphSize = size
	}

	startNode := 0
	if start, ok := parameters["start_node"].(int); ok {
		startNode = start
	}

	targetNode := 5
	if target, ok := parameters["target_node"].(int); ok {
		targetNode = target
	}

	// Generate a simple graph
	graph := generateGraph(graphSize)

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"graph":       graph,
			"start_node":  startNode,
			"target_node": targetNode,
		},
		Message:   fmt.Sprintf("Starting DFS from node %d to find node %d", startNode, targetNode),
		Timestamp: time.Now(),
	})

	visited := make([]bool, graphSize)
	stack := []int{startNode}
	path := []int{}
	stepNumber := 1

	for len(stack) > 0 {
		current := stack[len(stack)-1]
		stack = stack[:len(stack)-1]

		if visited[current] {
			continue
		}

		visited[current] = true
		path = append(path, current)

		stepCallback(types.ExecutionStep{
			StepNumber: stepNumber,
			Action:     "visit_node",
			Data: map[string]interface{}{
				"graph":       graph,
				"current":     current,
				"visited":     visited,
				"stack":       stack,
				"path":        path,
				"target_node": targetNode,
			},
			Message:   fmt.Sprintf("Visiting node %d", current),
			Timestamp: time.Now(),
		})
		stepNumber++

		if current == targetNode {
			stepCallback(types.ExecutionStep{
				StepNumber: stepNumber,
				Action:     "found",
				Data: map[string]interface{}{
					"graph":    graph,
					"found_at": current,
					"path":     path,
					"visited":  visited,
				},
				Message:   fmt.Sprintf("Target node %d found! Path: %v", targetNode, path),
				Timestamp: time.Now(),
			})

			return map[string]interface{}{
				"found":   true,
				"target":  targetNode,
				"path":    path,
				"visited": visited,
			}, nil
		}

		// Add unvisited neighbors to stack
		for _, neighbor := range graph[current] {
			if !visited[neighbor] {
				stack = append(stack, neighbor)
			}
		}

		stepCallback(types.ExecutionStep{
			StepNumber: stepNumber,
			Action:     "add_neighbors",
			Data: map[string]interface{}{
				"graph":     graph,
				"current":   current,
				"neighbors": graph[current],
				"stack":     stack,
				"visited":   visited,
			},
			Message:   fmt.Sprintf("Adding unvisited neighbors of %d to stack: %v", current, graph[current]),
			Timestamp: time.Now(),
		})
		stepNumber++
	}

	// Target not found
	stepCallback(types.ExecutionStep{
		StepNumber: stepNumber,
		Action:     "not_found",
		Data: map[string]interface{}{
			"graph":   graph,
			"visited": visited,
			"path":    path,
		},
		Message:   fmt.Sprintf("Target node %d not found", targetNode),
		Timestamp: time.Now(),
	})

	return map[string]interface{}{
		"found":   false,
		"target":  targetNode,
		"path":    path,
		"visited": visited,
	}, nil
}

// ValidateParameters validates the input parameters
func (dfs *DFS) ValidateParameters(parameters map[string]interface{}) error {
	if graphSize, ok := parameters["graph_size"].(int); ok {
		if graphSize < 3 || graphSize > 20 {
			return fmt.Errorf("graph_size must be between 3 and 20")
		}
	}
	return nil
}

// Helper function to generate a simple graph
func generateGraph(size int) [][]int {
	graph := make([][]int, size)

	// Create a simple connected graph
	for i := 0; i < size; i++ {
		neighbors := []int{}
		if i > 0 {
			neighbors = append(neighbors, i-1)
		}
		if i < size-1 {
			neighbors = append(neighbors, i+1)
		}
		// Add some random connections
		if i+2 < size {
			neighbors = append(neighbors, i+2)
		}
		graph[i] = neighbors
	}

	return graph
}
