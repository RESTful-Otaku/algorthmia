package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// SecurityHeaders adds security headers to responses
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prevent clickjacking
		c.Header("X-Frame-Options", "DENY")
		
		// Prevent MIME type sniffing
		c.Header("X-Content-Type-Options", "nosniff")
		
		// Enable XSS protection
		c.Header("X-XSS-Protection", "1; mode=block")
		
		// Strict Transport Security (HTTPS only)
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		
		// Content Security Policy
		c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'")
		
		// Referrer Policy
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		
		// Permissions Policy
		c.Header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
		
		c.Next()
	}
}

// RateLimit provides basic rate limiting
func RateLimit() gin.HandlerFunc {
	// Simple in-memory rate limiter
	// In production, use Redis or similar
	clients := make(map[string]*rateLimiter)
	
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		
		// Get or create rate limiter for this client
		limiter, exists := clients[clientIP]
		if !exists {
			limiter = &rateLimiter{
				requests: 0,
				window:   time.Now(),
			}
			clients[clientIP] = limiter
		}
		
		// Reset window if needed (1 minute windows)
		if time.Since(limiter.window) > time.Minute {
			limiter.requests = 0
			limiter.window = time.Now()
		}
		
		// Check rate limit (100 requests per minute)
		if limiter.requests >= 100 {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error":   "Rate limit exceeded. Please try again later.",
			})
			c.Abort()
			return
		}
		
		limiter.requests++
		c.Next()
	}
}

type rateLimiter struct {
	requests int
	window   time.Time
}

// RequestSizeLimit limits request body size
func RequestSizeLimit(maxSize int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxSize)
		c.Next()
	}
}

// Timeout sets a timeout for requests
func Timeout(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Set timeout
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()
		
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}
