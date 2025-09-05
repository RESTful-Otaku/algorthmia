package api

import (
	"fmt"
	"net/http"
	"regexp"

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

	// Validate algorithm ID
	if algorithmID == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Algorithm ID is required",
		})
		return
	}

	// Sanitize algorithm ID to prevent path traversal
	if len(algorithmID) > 50 || !isValidAlgorithmID(algorithmID) {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid algorithm ID format",
		})
		return
	}

	var config models.AlgorithmConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid request body: " + err.Error(),
		})
		return
	}

	// Validate and sanitize configuration
	if err := validateAlgorithmConfig(&config); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid configuration: " + err.Error(),
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
			"status":  "ok",
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

// isValidAlgorithmID validates algorithm ID format
func isValidAlgorithmID(id string) bool {
	// Only allow alphanumeric characters, underscores, and hyphens
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9_-]+$`, id)
	return matched
}

// validateAlgorithmConfig validates and sanitizes algorithm configuration
func validateAlgorithmConfig(config *models.AlgorithmConfig) error {
	// Validate array size
	if config.ArraySize < 1 {
		return fmt.Errorf("array size must be at least 1")
	}
	if config.ArraySize > 1000 {
		return fmt.Errorf("array size cannot exceed 1000")
	}

	// Validate speed
	if config.Speed < 1 {
		return fmt.Errorf("speed must be at least 1")
	}
	if config.Speed > 10 {
		return fmt.Errorf("speed cannot exceed 10")
	}

	// Validate data if provided
	if len(config.Data) > 0 {
		if len(config.Data) != config.ArraySize {
			return fmt.Errorf("data length must match array size")
		}

		// Validate data values
		for i, value := range config.Data {
			if value < -10000 || value > 10000 {
				return fmt.Errorf("data value at index %d is out of range", i)
			}
		}
	}

	// Validate custom parameters
	if config.CustomParams != nil {
		for key, value := range config.CustomParams {
			if len(key) > 50 {
				return fmt.Errorf("custom parameter key too long: %s", key)
			}
			// Only allow basic types
			switch value.(type) {
			case string, int, float64, bool:
				continue
			default:
				return fmt.Errorf("invalid custom parameter type for key: %s", key)
			}
		}
	}

	return nil
}
