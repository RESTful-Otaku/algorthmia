package api

import (
	"net/http"

	"algorthmia/backend/internal/algorithm"
	"algorthmia/backend/internal/models"

	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests
type Handler struct {
	algorithmManager algorithm.Manager
}

// NewHandler creates a new API handler
func NewHandler(algorithmManager algorithm.Manager) *Handler {
	return &Handler{
		algorithmManager: algorithmManager,
	}
}

// GetAlgorithms returns all available algorithms
func (h *Handler) GetAlgorithms(c *gin.Context) {
	algorithms := h.algorithmManager.ListAlgorithms()
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    algorithms,
	})
}

// GetAlgorithmsByType returns algorithms filtered by type
func (h *Handler) GetAlgorithmsByType(c *gin.Context) {
	algorithmType := c.Param("type")
	
	// Validate algorithm type
	validType := models.AlgorithmType(algorithmType)
	if validType != models.AlgorithmTypeSorting && 
	   validType != models.AlgorithmTypeSearch && 
	   validType != models.AlgorithmTypeGraph {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid algorithm type. Must be one of: sorting, search, graph",
		})
		return
	}
	
	algorithms := h.algorithmManager.ListAlgorithmsByType(validType)
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    algorithms,
	})
}

// GetAlgorithm returns a specific algorithm by ID
func (h *Handler) GetAlgorithm(c *gin.Context) {
	algorithmID := c.Param("id")
	
	executor, err := h.algorithmManager.GetAlgorithm(algorithmID)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}
	
	metadata := executor.GetMetadata()
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    metadata,
	})
}

// ExecuteAlgorithm executes an algorithm with the given configuration
func (h *Handler) ExecuteAlgorithm(c *gin.Context) {
	algorithmID := c.Param("id")
	
	var config models.AlgorithmConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid request body: " + err.Error(),
		})
		return
	}
	
	// Set default values if not provided
	if config.ArraySize == 0 {
		config.ArraySize = 20
	}
	if config.Speed == 0 {
		config.Speed = 5
	}
	
	steps, err := h.algorithmManager.ExecuteAlgorithm(c.Request.Context(), algorithmID, config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    steps,
	})
}

// GetAlgorithmConfig returns the default configuration for an algorithm
func (h *Handler) GetAlgorithmConfig(c *gin.Context) {
	algorithmID := c.Param("id")
	
	executor, err := h.algorithmManager.GetAlgorithm(algorithmID)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}
	
	config := executor.GetDefaultConfig()
	
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    config,
	})
}

// HealthCheck returns the health status of the API
func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "API is healthy",
		Data: map[string]interface{}{
			"status": "ok",
			"version": "1.0.0",
		},
	})
}

// SetupRoutes sets up all API routes
func (h *Handler) SetupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")
	{
		// Health check
		api.GET("/health", h.HealthCheck)
		
		// Algorithm endpoints
		api.GET("/algorithms", h.GetAlgorithms)
		api.GET("/algorithms/type/:type", h.GetAlgorithmsByType)
		api.GET("/algorithms/:id", h.GetAlgorithm)
		api.GET("/algorithms/:id/config", h.GetAlgorithmConfig)
		api.POST("/algorithms/:id/execute", h.ExecuteAlgorithm)
	}
}
