package algorithms

import (
	"algorthmia/internal/algorithms/searching"
	"algorthmia/internal/algorithms/sorting"
	"algorthmia/internal/types"
	"sync"
)

// Registry manages all available algorithms
type Registry struct {
	algorithms map[string]types.AlgorithmExecutor
	mutex      sync.RWMutex
}

// NewRegistry creates a new algorithm registry
func NewRegistry() *Registry {
	registry := &Registry{
		algorithms: make(map[string]types.AlgorithmExecutor),
	}

	// Register all algorithms
	registry.registerAlgorithms()

	return registry
}

// RegisterAlgorithm adds an algorithm to the registry
func (r *Registry) RegisterAlgorithm(algorithm types.AlgorithmExecutor) {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	metadata := algorithm.GetMetadata()
	r.algorithms[metadata.ID] = algorithm
}

// GetAlgorithm retrieves an algorithm by ID
func (r *Registry) GetAlgorithm(id string) (types.AlgorithmExecutor, bool) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	algorithm, exists := r.algorithms[id]
	return algorithm, exists
}

// GetAllAlgorithms returns all registered algorithms
func (r *Registry) GetAllAlgorithms() []types.Algorithm {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	algorithms := make([]types.Algorithm, 0, len(r.algorithms))
	for _, algorithm := range r.algorithms {
		algorithms = append(algorithms, algorithm.GetMetadata())
	}

	return algorithms
}

// GetAlgorithmsByCategory returns algorithms filtered by category
func (r *Registry) GetAlgorithmsByCategory(category types.AlgorithmCategory) []types.Algorithm {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	var algorithms []types.Algorithm
	for _, algorithm := range r.algorithms {
		metadata := algorithm.GetMetadata()
		if metadata.Category == category {
			algorithms = append(algorithms, metadata)
		}
	}

	return algorithms
}

// registerAlgorithms registers all available algorithms
func (r *Registry) registerAlgorithms() {
	// Register sorting algorithms
	r.RegisterAlgorithm(sorting.NewBubbleSort())
	r.RegisterAlgorithm(sorting.NewMergeSort())
	r.RegisterAlgorithm(sorting.NewQuickSort())
	r.RegisterAlgorithm(sorting.NewHeapSort())
	r.RegisterAlgorithm(sorting.NewCountingSort())

	// Register searching algorithms
	r.RegisterAlgorithm(searching.NewLinearSearch())
	r.RegisterAlgorithm(searching.NewBinarySearch())
	r.RegisterAlgorithm(searching.NewDFS())
	r.RegisterAlgorithm(searching.NewBFS())
	r.RegisterAlgorithm(searching.NewHashLookup())

	// More algorithms will be added in future iterations
}
