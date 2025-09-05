package middleware

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
	// HTTP request metrics
	httpDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "http_request_duration_seconds",
		Help:    "Duration of HTTP requests in seconds",
		Buckets: prometheus.DefBuckets,
	}, []string{"path", "method", "status"})

	httpRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "http_requests_total",
		Help: "Total number of HTTP requests",
	}, []string{"path", "method", "status"})

	httpRequestSize = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "http_request_size_bytes",
		Help:    "Size of HTTP requests in bytes",
		Buckets: prometheus.ExponentialBuckets(100, 10, 8),
	}, []string{"path", "method"})

	httpResponseSize = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "http_response_size_bytes",
		Help:    "Size of HTTP responses in bytes",
		Buckets: prometheus.ExponentialBuckets(100, 10, 8),
	}, []string{"path", "method", "status"})

	// Algorithm execution metrics
	algorithmExecutionsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "algorithm_executions_total",
		Help: "Total number of algorithm executions",
	}, []string{"algorithm_id", "status"})

	algorithmExecutionDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "algorithm_execution_duration_seconds",
		Help:    "Duration of algorithm executions in seconds",
		Buckets: prometheus.ExponentialBuckets(0.001, 2, 15),
	}, []string{"algorithm_id"})

	algorithmStepsTotal = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "algorithm_steps_total",
		Help:    "Total number of steps in algorithm executions",
		Buckets: prometheus.ExponentialBuckets(1, 2, 20),
	}, []string{"algorithm_id"})

	// WebSocket metrics
	websocketConnectionsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "websocket_connections_total",
		Help: "Total number of WebSocket connections",
	}, []string{"status"})

	websocketConnectionsActive = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "websocket_connections_active",
		Help: "Number of active WebSocket connections",
	})

	// Error metrics
	errorsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "errors_total",
		Help: "Total number of errors",
	}, []string{"type", "component"})
)

// MetricsMiddleware collects HTTP request metrics
func MetricsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		requestSize := c.Request.ContentLength
		if requestSize < 0 {
			requestSize = 0
		}

		c.Next()

		duration := time.Since(start)
		status := strconv.Itoa(c.Writer.Status())
		path := c.FullPath()
		method := c.Request.Method
		responseSize := c.Writer.Size()

		// Record metrics
		httpDuration.WithLabelValues(path, method, status).Observe(duration.Seconds())
		httpRequestsTotal.WithLabelValues(path, method, status).Inc()
		httpRequestSize.WithLabelValues(path, method).Observe(float64(requestSize))
		httpResponseSize.WithLabelValues(path, method, status).Observe(float64(responseSize))
	}
}

// TrackAlgorithmExecution records metrics for algorithm execution
func TrackAlgorithmExecution(algorithmID string, duration time.Duration, steps int, success bool) {
	status := "success"
	if !success {
		status = "error"
	}

	algorithmExecutionsTotal.WithLabelValues(algorithmID, status).Inc()
	algorithmExecutionDuration.WithLabelValues(algorithmID).Observe(duration.Seconds())
	algorithmStepsTotal.WithLabelValues(algorithmID).Observe(float64(steps))
}

// TrackWebSocketConnection records WebSocket connection metrics
func TrackWebSocketConnection(status string) {
	websocketConnectionsTotal.WithLabelValues(status).Inc()
	if status == "connected" {
		websocketConnectionsActive.Inc()
	} else if status == "disconnected" {
		websocketConnectionsActive.Dec()
	}
}

// TrackError records error metrics
func TrackError(errorType, component string) {
	errorsTotal.WithLabelValues(errorType, component).Inc()
}

// GetMetricsHandler returns a Gin handler that exposes Prometheus metrics
func GetMetricsHandler() gin.HandlerFunc {
	return gin.WrapH(promhttp.Handler())
}
