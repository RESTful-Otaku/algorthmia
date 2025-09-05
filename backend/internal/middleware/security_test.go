package middleware

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	// Add middleware
	router.Use(SecurityHeaders())
	router.Use(RateLimit())
	router.Use(RequestSizeLimit(1024)) // 1KB for testing
	router.Use(Timeout(5 * time.Second))

	// Add test route
	router.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	router.POST("/test", func(c *gin.Context) {
		// Read the body to trigger size limit check
		body, err := c.GetRawData()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "success", "size": len(body)})
	})

	return router
}

func TestSecurityHeaders(t *testing.T) {
	router := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Check security headers
	assert.Equal(t, "DENY", w.Header().Get("X-Frame-Options"))
	assert.Equal(t, "1; mode=block", w.Header().Get("X-XSS-Protection"))
	assert.Equal(t, "nosniff", w.Header().Get("X-Content-Type-Options"))
	assert.Equal(t, "max-age=31536000; includeSubDomains", w.Header().Get("Strict-Transport-Security"))
}

func TestRateLimit(t *testing.T) {
	router := setupTestRouter()

	// Test multiple requests
	for i := 0; i < 5; i++ {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/test", nil)
		router.ServeHTTP(w, req)

		// Should not be rate limited for small number of requests
		assert.Equal(t, http.StatusOK, w.Code)
	}
}

func TestRequestSizeLimit(t *testing.T) {
	router := setupTestRouter()

	// Test with small payload
	smallPayload := make([]byte, 100)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/test", bytes.NewReader(smallPayload))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Test with large payload (should be limited)
	largePayload := make([]byte, 2048) // 2KB, exceeds 1KB limit
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/test", bytes.NewReader(largePayload))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	// Should be rejected due to size limit (either 413 or 400 is acceptable)
	assert.True(t, w.Code == http.StatusRequestEntityTooLarge || w.Code == http.StatusBadRequest)
}

func TestTimeout(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	// Add timeout middleware with very short timeout
	router.Use(Timeout(1 * time.Millisecond))

	// Add route that takes longer than timeout
	router.GET("/slow", func(c *gin.Context) {
		select {
		case <-c.Request.Context().Done():
			// Context was cancelled due to timeout
			c.JSON(http.StatusGatewayTimeout, gin.H{"error": "request timeout"})
			return
		case <-time.After(10 * time.Millisecond):
			// This should not be reached due to timeout
			c.JSON(http.StatusOK, gin.H{"message": "success"})
		}
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/slow", nil)
	router.ServeHTTP(w, req)

	// Should timeout
	assert.Equal(t, http.StatusGatewayTimeout, w.Code)
}

func TestTimeoutNormalRequest(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	// Add timeout middleware with reasonable timeout
	router.Use(Timeout(1 * time.Second))

	// Add normal route
	router.GET("/fast", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/fast", nil)
	router.ServeHTTP(w, req)

	// Should succeed
	assert.Equal(t, http.StatusOK, w.Code)
}

// Benchmark tests
func BenchmarkSecurityHeaders(b *testing.B) {
	router := setupTestRouter()

	for i := 0; i < b.N; i++ {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/test", nil)
		router.ServeHTTP(w, req)
	}
}

func BenchmarkRateLimit(b *testing.B) {
	router := setupTestRouter()

	for i := 0; i < b.N; i++ {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/test", nil)
		router.ServeHTTP(w, req)
	}
}
