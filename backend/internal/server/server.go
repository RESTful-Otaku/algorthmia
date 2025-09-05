package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"algorthmia/backend/internal/algorithm"
	"algorthmia/backend/internal/algorithm/sorting"
	"algorthmia/backend/internal/api"
	"algorthmia/backend/internal/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// Server represents the HTTP server
type Server struct {
	config          *config.Config
	algorithmManager algorithm.Manager
	httpServer      *http.Server
	logger          *logrus.Logger
}

// NewServer creates a new server instance
func NewServer(cfg *config.Config) *Server {
	logger := logrus.New()
	logger.SetLevel(logrus.InfoLevel)
	if cfg.Logging.Format == "json" {
		logger.SetFormatter(&logrus.JSONFormatter{})
	}

	// Create algorithm manager and register algorithms
	algorithmManager := algorithm.NewManager()
	
	// Register sorting algorithms
	bubbleSort := sorting.NewBubbleSort()
	if err := algorithmManager.RegisterAlgorithm(bubbleSort); err != nil {
		logger.WithError(err).Fatal("Failed to register bubble sort algorithm")
	}

	return &Server{
		config:          cfg,
		algorithmManager: algorithmManager,
		logger:          logger,
	}
}

// Start starts the HTTP server
func (s *Server) Start() error {
	// Set Gin mode
	if s.config.Logging.Level == "debug" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create Gin router
	router := gin.New()

	// Add middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(cors.New(cors.Config{
		AllowOrigins:     s.config.CORS.AllowedOrigins,
		AllowMethods:     s.config.CORS.AllowedMethods,
		AllowHeaders:     s.config.CORS.AllowedHeaders,
		AllowCredentials: true,
	}))

	// Setup routes
	handler := api.NewHandler(s.algorithmManager)
	handler.SetupRoutes(router)

	// Serve static files (for frontend)
	router.Static("/static", "./frontend/dist")
	router.StaticFile("/", "./frontend/dist/index.html")

	// Create HTTP server
	s.httpServer = &http.Server{
		Addr:         fmt.Sprintf("%s:%d", s.config.Server.Host, s.config.Server.Port),
		Handler:      router,
		ReadTimeout:  time.Duration(s.config.Server.ReadTimeout) * time.Second,
		WriteTimeout: time.Duration(s.config.Server.WriteTimeout) * time.Second,
	}

	s.logger.WithFields(logrus.Fields{
		"host": s.config.Server.Host,
		"port": s.config.Server.Port,
	}).Info("Starting server")

	// Start server in goroutine
	go func() {
		if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.WithError(err).Fatal("Failed to start server")
		}
	}()

	return nil
}

// Stop gracefully stops the HTTP server
func (s *Server) Stop(ctx context.Context) error {
	s.logger.Info("Shutting down server...")
	
	if s.httpServer != nil {
		if err := s.httpServer.Shutdown(ctx); err != nil {
			s.logger.WithError(err).Error("Server shutdown failed")
			return err
		}
	}
	
	s.logger.Info("Server stopped")
	return nil
}

// GetAlgorithmManager returns the algorithm manager
func (s *Server) GetAlgorithmManager() algorithm.Manager {
	return s.algorithmManager
}
