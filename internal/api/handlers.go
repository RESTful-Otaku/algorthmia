package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"algorthmia/internal/algorithms"
	"algorthmia/internal/types"
	"algorthmia/internal/websocket"

	"github.com/gorilla/mux"
)

// Handlers contains all HTTP handlers
type Handlers struct {
	algorithmRegistry *algorithms.Registry
	hub               *websocket.Hub
}

// NewHandlers creates a new Handlers instance
func NewHandlers(algorithmRegistry *algorithms.Registry, hub *websocket.Hub) *Handlers {
	return &Handlers{
		algorithmRegistry: algorithmRegistry,
		hub:               hub,
	}
}

// GetAlgorithms returns all available algorithms
func (h *Handlers) GetAlgorithms(w http.ResponseWriter, r *http.Request) {
	algorithms := h.algorithmRegistry.GetAllAlgorithms()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"algorithms": algorithms,
		"count":      len(algorithms),
	})
}

// GetAlgorithm returns a specific algorithm by ID
func (h *Handlers) GetAlgorithm(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	algorithmID := vars["id"]

	algorithm, exists := h.algorithmRegistry.GetAlgorithm(algorithmID)
	if !exists {
		http.Error(w, "Algorithm not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(algorithm)
}

// ExecuteAlgorithm executes an algorithm with given parameters
func (h *Handlers) ExecuteAlgorithm(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	algorithmID := vars["id"]

	algorithm, exists := h.algorithmRegistry.GetAlgorithm(algorithmID)
	if !exists {
		http.Error(w, "Algorithm not found", http.StatusNotFound)
		return
	}

	var request struct {
		Parameters map[string]interface{} `json:"parameters"`
		Input      interface{}            `json:"input,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate parameters
	if err := algorithm.ValidateParameters(request.Parameters); err != nil {
		http.Error(w, fmt.Sprintf("Invalid parameters: %v", err), http.StatusBadRequest)
		return
	}

	// Create execution ID
	executionID := fmt.Sprintf("exec_%d", time.Now().UnixNano())

	// Create execution context
	execution := &types.AlgorithmExecution{
		ID:          executionID,
		AlgorithmID: algorithmID,
		Parameters:  request.Parameters,
		Input:       request.Input,
		Steps:       []types.ExecutionStep{},
		Status:      types.StatusRunning,
		StartTime:   time.Now(),
	}

	// Execute algorithm in a goroutine
	go h.executeAlgorithmAsync(algorithm, execution)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"execution_id": executionID,
		"status":       "started",
		"message":      "Algorithm execution started",
	})
}

// executeAlgorithmAsync executes the algorithm and sends updates via WebSocket
func (h *Handlers) executeAlgorithmAsync(algorithm types.AlgorithmExecutor, execution *types.AlgorithmExecution) {
	stepCallback := func(step types.ExecutionStep) {
		execution.Steps = append(execution.Steps, step)

		// Send step update via WebSocket
		message := types.WebSocketMessage{
			Type:      string(types.MessageTypeExecutionStep),
			Data:      step,
			Timestamp: time.Now(),
		}

		jsonData, _ := json.Marshal(message)
		h.hub.Broadcast(jsonData)
	}

	// Execute the algorithm
	output, err := algorithm.Execute(execution.Input, execution.Parameters, stepCallback)

	execution.Status = types.StatusCompleted
	now := time.Now()
	execution.EndTime = &now
	execution.Output = output

	// Send completion message
	var messageType types.WebSocketMessageType
	var messageData interface{}

	if err != nil {
		execution.Status = types.StatusError
		messageType = types.MessageTypeExecutionError
		messageData = map[string]interface{}{
			"execution_id": execution.ID,
			"error":        err.Error(),
		}
	} else {
		messageType = types.MessageTypeExecutionComplete
		messageData = map[string]interface{}{
			"execution_id": execution.ID,
			"output":       output,
			"steps_count":  len(execution.Steps),
		}
	}

	message := types.WebSocketMessage{
		Type:      string(messageType),
		Data:      messageData,
		Timestamp: time.Now(),
	}

	jsonData, _ := json.Marshal(message)
	h.hub.Broadcast(jsonData)
}

// GetExecutionStatus returns the status of a specific execution
func (h *Handlers) GetExecutionStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	_ = vars["id"] // executionID

	// In a real implementation, you would store executions in a database
	// For now, we'll return a placeholder response
	http.Error(w, "Execution status not implemented yet", http.StatusNotImplemented)
}

// HealthCheck returns the health status of the API
func (h *Handlers) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now(),
		"version":   "1.0.0",
	})
}

// GetCategories returns all algorithm categories
func (h *Handlers) GetCategories(w http.ResponseWriter, r *http.Request) {
	categories := []map[string]interface{}{
		{
			"id":          "sorting",
			"name":        "Sorting",
			"description": "Algorithms for sorting data structures",
			"icon":        "🔢",
		},
		{
			"id":          "searching",
			"name":        "Searching",
			"description": "Algorithms for searching data",
			"icon":        "🔎",
		},
		{
			"id":          "graphs_trees",
			"name":        "Graphs & Trees",
			"description": "Graph and tree algorithms",
			"icon":        "🌳",
		},
		{
			"id":          "pathfinding",
			"name":        "Pathfinding",
			"description": "Pathfinding and shortest path algorithms",
			"icon":        "🛣️",
		},
		{
			"id":          "dynamic_programming",
			"name":        "Dynamic Programming",
			"description": "Dynamic programming algorithms",
			"icon":        "🧮",
		},
		{
			"id":          "greedy",
			"name":        "Greedy Algorithms",
			"description": "Greedy optimization algorithms",
			"icon":        "💰",
		},
		{
			"id":          "strings",
			"name":        "String Algorithms",
			"description": "String processing algorithms",
			"icon":        "🧩",
		},
		{
			"id":          "number_theory",
			"name":        "Number Theory",
			"description": "Mathematical and number theory algorithms",
			"icon":        "🔐",
		},
		{
			"id":          "randomized",
			"name":        "Randomized",
			"description": "Randomized and probabilistic algorithms",
			"icon":        "🎲",
		},
		{
			"id":          "optimization",
			"name":        "Optimization",
			"description": "Optimization and flow algorithms",
			"icon":        "⚙️",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"categories": categories,
		"count":      len(categories),
	})
}
