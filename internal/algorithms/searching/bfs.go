package searching

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// BFS implements the breadth-first search algorithm
type BFS struct {
	metadata types.Algorithm
}

// NewBFS creates a new BFS instance
func NewBFS() *BFS {
	return &BFS{
		metadata: types.Algorithm{
			ID:          "bfs",
			Name:        "Breadth-First Search",
			Category:    types.CategorySearching,
			Description: "A graph traversal algorithm that explores all nodes at the present depth level before moving on to nodes at the next depth level.",
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
					Description: "Starting node for BFS",
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
func (bfs *BFS) GetMetadata() types.Algorithm {
	return bfs.metadata
}

// Execute runs the BFS algorithm
func (bfs *BFS) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
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
		Message:   fmt.Sprintf("Starting BFS from node %d to find node %d", startNode, targetNode),
		Timestamp: time.Now(),
	})

	visited := make([]bool, graphSize)
	queue := []int{startNode}
	path := []int{}
	stepNumber := 1

	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]

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
				"queue":       queue,
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

		// Add unvisited neighbors to queue
		for _, neighbor := range graph[current] {
			if !visited[neighbor] {
				queue = append(queue, neighbor)
			}
		}

		stepCallback(types.ExecutionStep{
			StepNumber: stepNumber,
			Action:     "add_neighbors",
			Data: map[string]interface{}{
				"graph":     graph,
				"current":   current,
				"neighbors": graph[current],
				"queue":     queue,
				"visited":   visited,
			},
			Message:   fmt.Sprintf("Adding unvisited neighbors of %d to queue: %v", current, graph[current]),
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
func (bfs *BFS) ValidateParameters(parameters map[string]interface{}) error {
	if graphSize, ok := parameters["graph_size"].(int); ok {
		if graphSize < 3 || graphSize > 20 {
			return fmt.Errorf("graph_size must be between 3 and 20")
		}
	}
	return nil
}
