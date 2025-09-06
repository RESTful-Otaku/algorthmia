package search

import (
	"math/rand"
	"time"
)

// generateSortedData generates a sorted array of random numbers
func generateSortedData(size int) []int {
	// Create a new random number generator with current time as seed
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	data := make([]int, size)

	// Generate sorted data starting from 1
	for i := 0; i < size; i++ {
		data[i] = i + 1
	}

	// Add some randomness to make it more interesting
	// Shuffle a few elements to create a mostly sorted array
	for i := 0; i < size/4; i++ {
		idx1 := r.Intn(size)
		idx2 := r.Intn(size)
		data[idx1], data[idx2] = data[idx2], data[idx1]
	}

	// Sort it back to ensure it's properly sorted
	for i := 0; i < size-1; i++ {
		for j := i + 1; j < size; j++ {
			if data[i] > data[j] {
				data[i], data[j] = data[j], data[i]
			}
		}
	}

	return data
}

// generateUnsortedData generates an unsorted array for linear search
func generateUnsortedData(size int) []int {
	// Create a new random number generator with current time as seed
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	data := make([]int, size)

	// Generate random data
	for i := 0; i < size; i++ {
		data[i] = r.Intn(100) + 1 // Random numbers from 1 to 100
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
