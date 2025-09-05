package sorting

import (
	"math/rand"
	"time"
)

// generateRandomData generates an array of random integers
func generateRandomData(size int) []int {
	// Use NewSource for better randomness (Go 1.20+)
	source := rand.NewSource(time.Now().UnixNano())
	rng := rand.New(source)
	
	data := make([]int, size)
	for i := 0; i < size; i++ {
		data[i] = rng.Intn(100) + 1 // Generate numbers between 1 and 100
	}
	
	return data
}

// isSorted checks if an array is sorted in ascending order
func isSorted(arr []int) bool {
	for i := 1; i < len(arr); i++ {
		if arr[i] < arr[i-1] {
			return false
		}
	}
	return true
}
