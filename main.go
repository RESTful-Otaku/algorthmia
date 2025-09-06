package main

import (
	"log"
	"net/http"
	"os"

	"algorthmia/internal/api"
	"algorthmia/internal/config"
	"algorthmia/internal/websocket"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Load configuration
	_ = config.Load()

	// Create router
	router := mux.NewRouter()

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Setup WebSocket hub
	hub := websocket.NewHub()
	go hub.Run()

	// Setup API routes
	api.SetupRoutes(router, hub)

	// Setup WebSocket route
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		websocket.HandleWebSocket(hub, w, r)
	})

	// Apply CORS middleware
	handler := c.Handler(router)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
