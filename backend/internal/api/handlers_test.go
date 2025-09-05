package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"algorthmia/backend/internal/algorithm"
	"algorthmia/backend/internal/algorithm/sorting"
	"algorthmia/backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	// Create algorithm manager and register test algorithms
	manager := algorithm.NewManager()
	bubbleSort := sorting.NewBubbleSort()
	manager.RegisterAlgorithm(bubbleSort)

	// Create handler and setup routes
	handler := NewHandler(manager)
	router := gin.New()
	handler.SetupRoutes(router)

	return router
}

func TestHealthCheck(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/health", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.True(t, response.Success)
	assert.Equal(t, "API is healthy", response.Message)

	data, ok := response.Data.(map[string]interface{})
	require.True(t, ok)
	assert.Equal(t, "ok", data["status"])
	assert.Equal(t, "1.0.0", data["version"])
}

func TestGetAlgorithms(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/algorithms", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.True(t, response.Success)
	assert.NotEmpty(t, response.Data)

	// Check that we have at least one algorithm
	algorithms, ok := response.Data.([]interface{})
	require.True(t, ok)
	assert.GreaterOrEqual(t, len(algorithms), 1)

	// Check algorithm structure
	algorithm, ok := algorithms[0].(map[string]interface{})
	require.True(t, ok)
	assert.NotEmpty(t, algorithm["id"])
	assert.NotEmpty(t, algorithm["name"])
	assert.NotEmpty(t, algorithm["description"])
	assert.NotEmpty(t, algorithm["category"])
	assert.NotEmpty(t, algorithm["time_complexity"])
	assert.NotEmpty(t, algorithm["space_complexity"])
}

func TestGetAlgorithm(t *testing.T) {
	router := setupTestRouter()

	// Test valid algorithm ID
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/algorithms/bubble_sort", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.True(t, response.Success)
	algorithm, ok := response.Data.(map[string]interface{})
	require.True(t, ok)
	assert.Equal(t, "bubble_sort", algorithm["id"])
}

func TestGetAlgorithmNotFound(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/algorithms/non-existent", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.False(t, response.Success)
	assert.Contains(t, response.Error, "not found")
}

func TestExecuteAlgorithm(t *testing.T) {
	router := setupTestRouter()

	config := models.AlgorithmConfig{
		ArraySize: 10,
		Speed:     1,
		Data:      []int{5, 2, 8, 1, 9, 3, 7, 4, 6, 0},
	}

	configJSON, _ := json.Marshal(config)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/algorithms/bubble_sort/execute", bytes.NewBuffer(configJSON))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.True(t, response.Success)
	assert.NotEmpty(t, response.Data)

	// Check that we have steps
	steps, ok := response.Data.([]interface{})
	require.True(t, ok)
	assert.Greater(t, len(steps), 0)

	step, ok := steps[0].(map[string]interface{})
	require.True(t, ok)
	assert.GreaterOrEqual(t, int(step["step_number"].(float64)), 0)
	assert.NotEmpty(t, step["action"])
	assert.NotNil(t, step["data"])
}

func TestExecuteAlgorithmInvalidConfig(t *testing.T) {
	router := setupTestRouter()

	// Test with invalid array size
	config := models.AlgorithmConfig{
		ArraySize: -1, // Invalid
		Speed:     1,
	}

	configJSON, _ := json.Marshal(config)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/algorithms/bubble_sort/execute", bytes.NewBuffer(configJSON))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.False(t, response.Success)
	assert.Contains(t, response.Error, "array size must be at least 1")
}

func TestExecuteAlgorithmNotFound(t *testing.T) {
	router := setupTestRouter()

	config := models.AlgorithmConfig{
		ArraySize: 10,
		Speed:     1,
	}

	configJSON, _ := json.Marshal(config)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/algorithms/non-existent/execute", bytes.NewBuffer(configJSON))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestExecuteAlgorithmInvalidJSON(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/algorithms/bubble_sort/execute", bytes.NewBufferString("invalid json"))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestExecuteAlgorithmEmptyBody(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/algorithms/bubble_sort/execute", nil)
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestExecuteAlgorithmInvalidAlgorithmID(t *testing.T) {
	router := setupTestRouter()

	config := models.AlgorithmConfig{
		ArraySize: 10,
		Speed:     1,
	}

	configJSON, _ := json.Marshal(config)

	// Test with invalid algorithm ID format
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/algorithms/invalid@id/execute", bytes.NewBuffer(configJSON))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.False(t, response.Success)
	assert.Contains(t, response.Error, "Invalid algorithm ID format")
}

func TestGetAlgorithmConfig(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/algorithms/bubble_sort/config", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	require.NoError(t, err)

	assert.True(t, response.Success)
	assert.NotNil(t, response.Data)
	config, ok := response.Data.(map[string]interface{})
	require.True(t, ok)
	assert.Greater(t, int(config["array_size"].(float64)), 0)
	assert.Greater(t, int(config["speed"].(float64)), 0)
}

func TestGetAlgorithmConfigNotFound(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/v1/algorithms/non-existent/config", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

// Benchmark tests
func BenchmarkGetAlgorithms(b *testing.B) {
	router := setupTestRouter()

	for i := 0; i < b.N; i++ {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/v1/algorithms", nil)
		router.ServeHTTP(w, req)
	}
}

func BenchmarkExecuteAlgorithm(b *testing.B) {
	router := setupTestRouter()

	config := models.AlgorithmConfig{
		ArraySize: 20,
		Speed:     1,
		Data:      []int{5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20},
	}

	configJSON, _ := json.Marshal(config)

	for i := 0; i < b.N; i++ {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/v1/algorithms/bubble_sort/execute", bytes.NewBuffer(configJSON))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
	}
}
