package api

import (
	"algorthmia/internal/algorithms"
	"algorthmia/internal/websocket"

	"github.com/gorilla/mux"
)

// SetupRoutes configures all API routes
func SetupRoutes(router *mux.Router, hub *websocket.Hub) {
	// Create algorithm registry
	registry := algorithms.NewRegistry()

	// Create handlers
	handlers := NewHandlers(registry, hub)

	// API version prefix
	api := router.PathPrefix("/api/v1").Subrouter()

	// Health check
	api.HandleFunc("/health", handlers.HealthCheck).Methods("GET")

	// Algorithm endpoints
	api.HandleFunc("/algorithms", handlers.GetAlgorithms).Methods("GET")
	api.HandleFunc("/algorithms/{id}", handlers.GetAlgorithm).Methods("GET")
	api.HandleFunc("/algorithms/{id}/execute", handlers.ExecuteAlgorithm).Methods("POST")

	// Categories
	api.HandleFunc("/categories", handlers.GetCategories).Methods("GET")

	// Execution status
	api.HandleFunc("/executions/{id}", handlers.GetExecutionStatus).Methods("GET")

	// WebSocket endpoint is handled in main.go
}
