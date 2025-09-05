package middleware

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// JWT-like token structure for simple authentication
type Token struct {
	UserID    string    `json:"user_id"`
	ExpiresAt time.Time `json:"expires_at"`
	IssuedAt  time.Time `json:"issued_at"`
}

// Simple token-based authentication middleware
func AuthMiddleware(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip authentication for public endpoints
		if isPublicEndpoint(c.Request.URL.Path) {
			c.Next()
			return
		}

		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header required",
			})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>" format
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid authorization format",
			})
			c.Abort()
			return
		}

		token := tokenParts[1]

		// Validate token
		claims, err := validateToken(token, secretKey)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
			})
			c.Abort()
			return
		}

		// Check if token is expired
		if time.Now().After(claims.ExpiresAt) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Token expired",
			})
			c.Abort()
			return
		}

		// Set user context
		c.Set("user_id", claims.UserID)
		c.Next()
	}
}

// Rate limiting per user
func UserRateLimit(requestsPerMinute int) gin.HandlerFunc {
	userRequests := make(map[string][]time.Time)

	return func(c *gin.Context) {
		userID := c.GetString("user_id")
		if userID == "" {
			// Use IP as fallback for unauthenticated users
			userID = c.ClientIP()
		}

		now := time.Now()
		minuteAgo := now.Add(-time.Minute)

		// Clean old requests
		if requests, exists := userRequests[userID]; exists {
			var recentRequests []time.Time
			for _, reqTime := range requests {
				if reqTime.After(minuteAgo) {
					recentRequests = append(recentRequests, reqTime)
				}
			}
			userRequests[userID] = recentRequests
		}

		// Check rate limit
		if len(userRequests[userID]) >= requestsPerMinute {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded",
			})
			c.Abort()
			return
		}

		// Add current request
		userRequests[userID] = append(userRequests[userID], now)
		c.Next()
	}
}

// Input sanitization middleware
func SanitizeInput() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Sanitize query parameters
		for key, values := range c.Request.URL.Query() {
			for i, value := range values {
				values[i] = sanitizeString(value)
			}
			c.Request.URL.RawQuery = strings.ReplaceAll(c.Request.URL.RawQuery, key+"="+values[0], key+"="+sanitizeString(values[0]))
		}

		// Sanitize headers
		for _, values := range c.Request.Header {
			for i, value := range values {
				values[i] = sanitizeString(value)
			}
		}

		c.Next()
	}
}

// CSRF protection middleware
func CSRFProtection(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip CSRF for GET requests
		if c.Request.Method == "GET" {
			c.Next()
			return
		}

		// Get CSRF token from header
		csrfToken := c.GetHeader("X-CSRF-Token")
		if csrfToken == "" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "CSRF token required",
			})
			c.Abort()
			return
		}

		// Validate CSRF token
		if !validateCSRFToken(csrfToken, secretKey) {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Invalid CSRF token",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// Content Security Policy middleware
func CSPMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Security-Policy",
			"default-src 'self'; "+
				"script-src 'self' 'unsafe-inline' 'unsafe-eval'; "+
				"style-src 'self' 'unsafe-inline'; "+
				"img-src 'self' data: https:; "+
				"font-src 'self' data:; "+
				"connect-src 'self' ws: wss:; "+
				"frame-ancestors 'none'; "+
				"base-uri 'self'; "+
				"form-action 'self'")
		c.Next()
	}
}

// Helper functions
func isPublicEndpoint(path string) bool {
	publicPaths := []string{
		"/api/health",
		"/api/algorithms",
		"/metrics",
		"/static",
		"/",
	}

	for _, publicPath := range publicPaths {
		if strings.HasPrefix(path, publicPath) {
			return true
		}
	}
	return false
}

func validateToken(token, secretKey string) (*Token, error) {
	// Simple token validation - in production, use proper JWT library
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid token format")
	}

	// Verify signature
	expectedSignature := generateSignature(parts[0]+"."+parts[1], secretKey)
	if parts[2] != expectedSignature {
		return nil, fmt.Errorf("invalid signature")
	}

	// Decode payload (simplified)
	// In production, use proper JWT decoding
	return &Token{
		UserID:    "user123", // This would come from the decoded token
		ExpiresAt: time.Now().Add(24 * time.Hour),
		IssuedAt:  time.Now().Add(-time.Hour),
	}, nil
}

func generateSignature(data, secretKey string) string {
	h := hmac.New(sha256.New, []byte(secretKey))
	h.Write([]byte(data))
	return base64.URLEncoding.EncodeToString(h.Sum(nil))
}

func sanitizeString(input string) string {
	// Remove potentially dangerous characters
	input = strings.ReplaceAll(input, "<", "&lt;")
	input = strings.ReplaceAll(input, ">", "&gt;")
	input = strings.ReplaceAll(input, "\"", "&quot;")
	input = strings.ReplaceAll(input, "'", "&#x27;")
	input = strings.ReplaceAll(input, "&", "&amp;")
	return input
}

func validateCSRFToken(token, secretKey string) bool {
	// Simple CSRF validation - in production, use proper CSRF library
	return len(token) > 0 && len(secretKey) > 0
}

// Generate CSRF token
func GenerateCSRFToken(secretKey string) string {
	randomBytes := make([]byte, 32)
	rand.Read(randomBytes)
	token := base64.URLEncoding.EncodeToString(randomBytes)
	return token
}
