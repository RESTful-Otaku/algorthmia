package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"regexp"

	"algorthmia/backend/internal/algorithm"
	"algorthmia/backend/internal/algorithm/sorting"
	"algorthmia/backend/internal/api"
	"algorthmia/backend/internal/models"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.TestMode)

	// Create algorithm manager and register test algorithms
	manager := algorithm.NewManager()
	bubbleSort := sorting.NewBubbleSort()
	manager.RegisterAlgorithm(bubbleSort)

	// Create handler and setup routes
	handler := api.NewHandler(manager)
	router := gin.New()
	handler.SetupRoutes(router)

	// Test the invalid algorithm ID
	config := models.AlgorithmConfig{
		ArraySize: 10,
		Speed:     1,
	}

	configJSON, _ := json.Marshal(config)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/algorithms/../../../etc/passwd/execute", bytes.NewBuffer(configJSON))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	fmt.Printf("Status Code: %d\n", w.Code)
	fmt.Printf("Response Body: %s\n", w.Body.String())

	// Test the regex validation
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9_-]+$`, "../../../etc/passwd")
	fmt.Printf("Regex validation result: %t\n", matched)
}
