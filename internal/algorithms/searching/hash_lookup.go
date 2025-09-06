package searching

import (
	"algorthmia/internal/types"
	"fmt"
	"time"
)

// HashLookup implements the hash table lookup algorithm
type HashLookup struct {
	metadata types.Algorithm
}

// NewHashLookup creates a new HashLookup instance
func NewHashLookup() *HashLookup {
	return &HashLookup{
		metadata: types.Algorithm{
			ID:          "hash_lookup",
			Name:        "Hash Lookup",
			Category:    types.CategorySearching,
			Description: "A search algorithm that uses a hash table to achieve O(1) average time complexity for lookups.",
			BigO:        "Time: O(1) average, O(n) worst case, Space: O(n)",
			Parameters: []types.Parameter{
				{
					Name:        "table_size",
					Type:        "int",
					Description: "Size of the hash table",
					Default:     10,
					Min:         intPtr(5),
					Max:         intPtr(50),
					Required:    true,
				},
				{
					Name:        "key",
					Type:        "string",
					Description: "Key to search for",
					Default:     "key5",
					Required:    true,
				},
			},
		},
	}
}

// GetMetadata returns the algorithm metadata
func (hl *HashLookup) GetMetadata() types.Algorithm {
	return hl.metadata
}

// Execute runs the hash lookup algorithm
func (hl *HashLookup) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
	tableSize := 10
	if size, ok := parameters["table_size"].(int); ok {
		tableSize = size
	}

	key := "key5"
	if k, ok := parameters["key"].(string); ok {
		key = k
	}

	// Generate a hash table
	hashTable := generateHashTable(tableSize)

	// Send initial state
	stepCallback(types.ExecutionStep{
		StepNumber: 0,
		Action:     "initialize",
		Data: map[string]interface{}{
			"hash_table": hashTable,
			"key":        key,
			"table_size": tableSize,
		},
		Message:   fmt.Sprintf("Starting Hash Lookup for key: %s", key),
		Timestamp: time.Now(),
	})

	// Calculate hash
	hash := hl.hashFunction(key, tableSize)

	stepCallback(types.ExecutionStep{
		StepNumber: 1,
		Action:     "calculate_hash",
		Data: map[string]interface{}{
			"hash_table": hashTable,
			"key":        key,
			"hash":       hash,
			"table_size": tableSize,
		},
		Message:   fmt.Sprintf("Calculated hash for key '%s': %d", key, hash),
		Timestamp: time.Now(),
	})

	// Look up in hash table
	if bucket, exists := hashTable[hash]; exists {
		stepCallback(types.ExecutionStep{
			StepNumber: 2,
			Action:     "check_bucket",
			Data: map[string]interface{}{
				"hash_table": hashTable,
				"key":        key,
				"hash":       hash,
				"bucket":     bucket,
			},
			Message:   fmt.Sprintf("Checking bucket at index %d", hash),
			Timestamp: time.Now(),
		})

		// Search within the bucket (handling collisions)
		for i, entry := range bucket {
			stepCallback(types.ExecutionStep{
				StepNumber: 3 + i,
				Action:     "check_entry",
				Data: map[string]interface{}{
					"hash_table": hashTable,
					"key":        key,
					"hash":       hash,
					"bucket":     bucket,
					"entry":      entry,
					"index":      i,
				},
				Message:   fmt.Sprintf("Checking entry %d in bucket: %s", i, entry.Key),
				Timestamp: time.Now(),
			})

			if entry.Key == key {
				stepCallback(types.ExecutionStep{
					StepNumber: 3 + i + 1,
					Action:     "found",
					Data: map[string]interface{}{
						"hash_table": hashTable,
						"key":        key,
						"hash":       hash,
						"value":      entry.Value,
						"bucket":     bucket,
					},
					Message:   fmt.Sprintf("Key '%s' found with value: %s", key, entry.Value),
					Timestamp: time.Now(),
				})

				return map[string]interface{}{
					"found":      true,
					"key":        key,
					"value":      entry.Value,
					"hash":       hash,
					"collisions": len(bucket) - 1,
				}, nil
			}
		}
	}

	// Key not found
	stepCallback(types.ExecutionStep{
		StepNumber: -1,
		Action:     "not_found",
		Data: map[string]interface{}{
			"hash_table": hashTable,
			"key":        key,
			"hash":       hash,
		},
		Message:   fmt.Sprintf("Key '%s' not found in hash table", key),
		Timestamp: time.Now(),
	})

	return map[string]interface{}{
		"found": false,
		"key":   key,
		"value": nil,
		"hash":  hash,
	}, nil
}

// ValidateParameters validates the input parameters
func (hl *HashLookup) ValidateParameters(parameters map[string]interface{}) error {
	if tableSize, ok := parameters["table_size"].(int); ok {
		if tableSize < 5 || tableSize > 50 {
			return fmt.Errorf("table_size must be between 5 and 50")
		}
	}
	return nil
}

// HashEntry represents an entry in the hash table
type HashEntry struct {
	Key   string
	Value string
}

// hashFunction calculates a simple hash for the key
func (hl *HashLookup) hashFunction(key string, tableSize int) int {
	hash := 0
	for _, char := range key {
		hash = (hash + int(char)) % tableSize
	}
	return hash
}

// generateHashTable creates a sample hash table
func generateHashTable(size int) map[int][]HashEntry {
	hashTable := make(map[int][]HashEntry)

	// Generate some sample data
	keys := []string{"key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "key10"}
	values := []string{"value1", "value2", "value3", "value4", "value5", "value6", "value7", "value8", "value9", "value10"}

	for i, key := range keys {
		if i >= size {
			break
		}
		hash := 0
		for _, char := range key {
			hash = (hash + int(char)) % size
		}

		entry := HashEntry{Key: key, Value: values[i]}
		hashTable[hash] = append(hashTable[hash], entry)
	}

	return hashTable
}
