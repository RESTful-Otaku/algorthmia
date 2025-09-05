package models

import (
	"time"
)

// AlgorithmType represents the type of algorithm
type AlgorithmType string

const (
	AlgorithmTypeSorting AlgorithmType = "sorting"
	AlgorithmTypeSearch  AlgorithmType = "search"
	AlgorithmTypeGraph   AlgorithmType = "graph"
)

// Algorithm represents an algorithm with its metadata
type Algorithm struct {
	ID          string        `json:"id"`
	Name        string        `json:"name"`
	Type        AlgorithmType `json:"type"`
	Description string        `json:"description"`
	TimeComplexity string     `json:"time_complexity"`
	SpaceComplexity string    `json:"space_complexity"`
	Category    string        `json:"category"`
	Enabled     bool          `json:"enabled"`
}

// AlgorithmStep represents a single step in algorithm execution
type AlgorithmStep struct {
	StepNumber int                    `json:"step_number"`
	Action     string                 `json:"action"`
	Data       []int                  `json:"data"`
	Highlights []int                  `json:"highlights"`
	Metadata   map[string]interface{} `json:"metadata"`
	Timestamp  time.Time              `json:"timestamp"`
}

// AlgorithmExecution represents the execution state of an algorithm
type AlgorithmExecution struct {
	ID          string          `json:"id"`
	AlgorithmID string          `json:"algorithm_id"`
	Steps       []AlgorithmStep `json:"steps"`
	CurrentStep int             `json:"current_step"`
	IsRunning   bool            `json:"is_running"`
	IsPaused    bool            `json:"is_paused"`
	IsComplete  bool            `json:"is_complete"`
	StartTime   time.Time       `json:"start_time"`
	EndTime     *time.Time      `json:"end_time,omitempty"`
}

// AlgorithmConfig represents configuration for algorithm execution
type AlgorithmConfig struct {
	ArraySize     int     `json:"array_size"`
	Speed         int     `json:"speed"`
	Data          []int   `json:"data,omitempty"`
	CustomParams  map[string]interface{} `json:"custom_params,omitempty"`
}

// VisualizationData represents data for visualization
type VisualizationData struct {
	Type        string                 `json:"type"`
	Data        []int                  `json:"data"`
	Highlights  []int                  `json:"highlights"`
	Metadata    map[string]interface{} `json:"metadata"`
	StepNumber  int                    `json:"step_number"`
	IsComplete  bool                   `json:"is_complete"`
}

// Notification represents a notification to be sent to the frontend
type Notification struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"` // info, success, warning, error
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Duration  int       `json:"duration"` // in milliseconds
	Timestamp time.Time `json:"timestamp"`
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// WebSocketMessage represents a WebSocket message
type WebSocketMessage struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}
