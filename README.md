# Algorthmia - Algorithm Visualization Backend

A high-performance Go backend for the Algorthmia algorithm visualization web application. This backend provides a unified API for executing and visualizing various algorithms in real-time.

## Features

- **Unified API Architecture**: Consistent interface for all algorithm categories
- **Real-time Updates**: WebSocket support for live algorithm execution visualization
- **Multi-threaded Execution**: Concurrent algorithm execution with performance optimization
- **Comprehensive Algorithm Support**: 
  - Sorting algorithms (Bubble, Merge, Quick, Heap, Counting)
  - Searching algorithms (Linear, Binary, DFS, BFS, Hash)
  - More categories coming soon
- **Parameter Validation**: Robust input validation and error handling
- **CORS Support**: Ready for frontend integration
- **Docker Ready**: Containerized deployment support

## Tech Stack

- **Language**: Go 1.21
- **Web Framework**: Gorilla Mux
- **WebSocket**: Gorilla WebSocket
- **CORS**: RS CORS
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Go 1.21 or later
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd algorthmia
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Run the server**
   ```bash
   go run main.go
   ```

4. **Access the API**
   - Server runs on `http://localhost:8080`
   - Health check: `GET /api/v1/health`
   - WebSocket: `ws://localhost:8080/ws`

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t algorthmia-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 8080:8080 algorthmia-backend
   ```

## API Endpoints

### Health Check
- `GET /api/v1/health` - Server health status

### Algorithms
- `GET /api/v1/algorithms` - Get all available algorithms
- `GET /api/v1/algorithms/{id}` - Get specific algorithm details
- `POST /api/v1/algorithms/{id}/execute` - Execute an algorithm

### Categories
- `GET /api/v1/categories` - Get all algorithm categories

### Executions
- `GET /api/v1/executions/{id}` - Get execution status

## WebSocket Events

The backend sends real-time updates via WebSocket:

- `execution_step` - Algorithm execution step
- `execution_complete` - Algorithm completed successfully
- `execution_error` - Algorithm execution failed
- `execution_pause` - Algorithm execution paused
- `execution_resume` - Algorithm execution resumed
- `execution_cancel` - Algorithm execution cancelled

## Algorithm Categories

### 🔢 Sorting Algorithms
- **Bubble Sort** - Simple comparison-based sorting
- **Merge Sort** - Divide and conquer sorting
- **Quick Sort** - Pivot-based partitioning
- **Heap Sort** - Heap data structure sorting
- **Counting Sort** - Non-comparison counting sort

### 🔎 Searching Algorithms
- **Linear Search** - Sequential search
- **Binary Search** - Divide and conquer search
- **DFS** - Depth-first graph traversal
- **BFS** - Breadth-first graph traversal
- **Hash Lookup** - Hash table lookup

## Configuration

Environment variables:

- `PORT` - Server port (default: 8080)
- `ENVIRONMENT` - Environment (development/production)
- `DEBUG` - Debug mode (true/false)

## Project Structure

```
algorthmia/
├── main.go                 # Application entry point
├── go.mod                  # Go module file
├── Dockerfile             # Docker configuration
├── README.md              # This file
└── internal/
    ├── api/               # HTTP handlers and routes
    ├── algorithms/        # Algorithm implementations
    │   ├── sorting/       # Sorting algorithms
    │   └── searching/     # Searching algorithms
    ├── config/            # Configuration management
    ├── types/             # Type definitions
    └── websocket/         # WebSocket handling
```

## Development

### Adding New Algorithms

1. Create a new file in the appropriate category directory
2. Implement the `AlgorithmExecutor` interface
3. Register the algorithm in `internal/algorithms/registry.go`

### Example Algorithm Implementation

```go
type MyAlgorithm struct {
    metadata types.Algorithm
}

func (ma *MyAlgorithm) GetMetadata() types.Algorithm {
    return ma.metadata
}

func (ma *MyAlgorithm) Execute(input interface{}, parameters map[string]interface{}, stepCallback func(types.ExecutionStep)) (interface{}, error) {
    // Algorithm implementation
    return result, nil
}

func (ma *MyAlgorithm) ValidateParameters(parameters map[string]interface{}) error {
    // Parameter validation
    return nil
}
```

## Performance Considerations

- Algorithms run in separate goroutines to prevent blocking
- WebSocket connections are managed efficiently with proper cleanup
- Memory usage is optimized for concurrent executions
- Input validation prevents resource exhaustion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] Additional algorithm categories (Graphs, Pathfinding, DP, etc.)
- [ ] Algorithm execution history and persistence
- [ ] Performance metrics and analytics
- [ ] Rate limiting and security enhancements
- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit and integration tests
- [ ] CI/CD pipeline setup
