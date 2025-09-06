package types

import "time"

// AlgorithmCategory represents the category of an algorithm
type AlgorithmCategory string

const (
	CategorySorting            AlgorithmCategory = "sorting"
	CategorySearching          AlgorithmCategory = "searching"
	CategoryGraphsTrees        AlgorithmCategory = "graphs_trees"
	CategoryPathfinding        AlgorithmCategory = "pathfinding"
	CategoryDynamicProgramming AlgorithmCategory = "dynamic_programming"
	CategoryGreedy             AlgorithmCategory = "greedy"
	CategoryStrings            AlgorithmCategory = "strings"
	CategoryNumberTheory       AlgorithmCategory = "number_theory"
	CategoryRandomized         AlgorithmCategory = "randomized"
	CategoryOptimization       AlgorithmCategory = "optimization"
)

// Algorithm represents a single algorithm with its metadata
type Algorithm struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	Category    AlgorithmCategory `json:"category"`
	Description string            `json:"description"`
	BigO        string            `json:"big_o"`
	Parameters  []Parameter       `json:"parameters"`
}

// Parameter represents a configurable parameter for an algorithm
type Parameter struct {
	Name        string      `json:"name"`
	Type        string      `json:"type"` // "int", "string", "bool", "array"
	Description string      `json:"description"`
	Default     interface{} `json:"default"`
	Min         *int        `json:"min,omitempty"`
	Max         *int        `json:"max,omitempty"`
	Required    bool        `json:"required"`
}

// AlgorithmExecution represents the execution state of an algorithm
type AlgorithmExecution struct {
	ID          string                 `json:"id"`
	AlgorithmID string                 `json:"algorithm_id"`
	Parameters  map[string]interface{} `json:"parameters"`
	Input       interface{}            `json:"input"`
	Output      interface{}            `json:"output,omitempty"`
	Steps       []ExecutionStep        `json:"steps"`
	Status      ExecutionStatus        `json:"status"`
	StartTime   time.Time              `json:"start_time"`
	EndTime     *time.Time             `json:"end_time,omitempty"`
}

// ExecutionStep represents a single step in algorithm execution
type ExecutionStep struct {
	StepNumber int                    `json:"step_number"`
	Action     string                 `json:"action"`
	Data       map[string]interface{} `json:"data"`
	Message    string                 `json:"message,omitempty"`
	Timestamp  time.Time              `json:"timestamp"`
}

// ExecutionStatus represents the current status of algorithm execution
type ExecutionStatus string

const (
	StatusPending   ExecutionStatus = "pending"
	StatusRunning   ExecutionStatus = "running"
	StatusPaused    ExecutionStatus = "paused"
	StatusCompleted ExecutionStatus = "completed"
	StatusError     ExecutionStatus = "error"
	StatusCancelled ExecutionStatus = "cancelled"
)

// AlgorithmExecutor defines the interface that all algorithms must implement
type AlgorithmExecutor interface {
	GetMetadata() Algorithm
	Execute(input interface{}, parameters map[string]interface{}, stepCallback func(ExecutionStep)) (interface{}, error)
	ValidateParameters(parameters map[string]interface{}) error
}

// WebSocketMessage represents a message sent over WebSocket
type WebSocketMessage struct {
	Type      string      `json:"type"`
	Data      interface{} `json:"data"`
	Timestamp time.Time   `json:"timestamp"`
}

// WebSocketMessageType represents the type of WebSocket message
type WebSocketMessageType string

const (
	MessageTypeExecutionStep     WebSocketMessageType = "execution_step"
	MessageTypeExecutionComplete WebSocketMessageType = "execution_complete"
	MessageTypeExecutionError    WebSocketMessageType = "execution_error"
	MessageTypeExecutionPause    WebSocketMessageType = "execution_pause"
	MessageTypeExecutionResume   WebSocketMessageType = "execution_resume"
	MessageTypeExecutionCancel   WebSocketMessageType = "execution_cancel"
)
