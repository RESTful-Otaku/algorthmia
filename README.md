# 🎯 Algorithm Visualizer

A professional, interactive algorithm visualization web application designed to demonstrate full-stack development skills and provide an educational tool for understanding sorting algorithms.

![Algorithm Visualizer](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Go](https://img.shields.io/badge/Go-1.21+-blue)
![Svelte](https://img.shields.io/badge/Svelte-5-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ Features

### 🎨 **Interactive Visualization**
- Real-time algorithm execution with step-by-step visualization
- Interactive grid-based data representation
- Smooth animations and visual feedback
- Customizable array sizes and execution speeds

### 🔧 **Algorithm Support**
- **Bubble Sort** - O(n²) time complexity
- **Selection Sort** - O(n²) time complexity  
- **Insertion Sort** - O(n²) time complexity
- **Merge Sort** - O(n log n) time complexity
- **Quick Sort** - O(n log n) average, O(n²) worst case

### 🎛️ **User Experience**
- Light/Dark theme with smooth transitions
- Responsive design for all screen sizes
- Real-time notifications and status updates
- Intuitive control panel with play/pause/scrub controls
- Collapsible side panel with algorithm selection
- Fuzzy search for algorithm discovery

### 🏗️ **Technical Excellence**
- Clean, modular architecture
- Comprehensive error handling
- Type-safe TypeScript throughout
- Modern Go best practices
- RESTful API design
- Context-aware cancellation
- Memory-efficient implementations

## 🚀 Quick Start

### Prerequisites
- Go 1.21 or later
- Node.js 18+ or Bun
- Modern web browser

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd algorthmia
   ```

2. **Start the backend**
   ```bash
   cd backend
   go mod download
   go run cmd/server/main.go
   ```

3. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   bun install  # or npm install
   bun run dev  # or npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
# Build everything
./scripts/build.sh

# Start production server
cd build
./start.sh
```

## 🏛️ Architecture

### Backend (Go)
```
backend/
├── cmd/server/          # Application entry point
├── internal/
│   ├── api/            # HTTP handlers and routes
│   ├── algorithm/      # Algorithm engine and implementations
│   ├── config/         # Configuration management
│   ├── models/         # Data models and types
│   └── server/         # Server setup and middleware
├── pkg/                # Shared utilities
└── config.yaml         # Configuration file
```

### Frontend (Svelte + TypeScript)
```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable UI components
│   │   ├── stores/         # State management
│   │   ├── types.ts        # TypeScript definitions
│   │   └── api.ts          # API client
│   └── routes/             # Application pages
├── static/                 # Static assets
└── tailwind.config.js      # Styling configuration
```

## 🔌 API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/algorithms` | List all algorithms |
| `GET` | `/api/v1/algorithms/type/{type}` | Get algorithms by type |
| `GET` | `/api/v1/algorithms/{id}` | Get specific algorithm |
| `GET` | `/api/v1/algorithms/{id}/config` | Get algorithm configuration |
| `POST` | `/api/v1/algorithms/{id}/execute` | Execute algorithm |

### Example API Usage

```bash
# Get all algorithms
curl http://localhost:8080/api/v1/algorithms

# Execute bubble sort
curl -X POST http://localhost:8080/api/v1/algorithms/bubble_sort/execute \
  -H "Content-Type: application/json" \
  -d '{"array_size": 10, "speed": 5}'
```

## 🎨 UI Components

### Core Components
- **Header** - App title, algorithm info, theme toggle
- **Visualizer** - Interactive algorithm visualization grid
- **ControlPanel** - Play/pause/scrub controls and speed adjustment
- **SidePanel** - Algorithm selection and configuration
- **NotificationContainer** - Toast notifications and status updates

### Design System
- **Color Palette** - Primary, secondary, accent, success, warning, error
- **Typography** - Inter (UI), JetBrains Mono (code)
- **Animations** - Smooth transitions and micro-interactions
- **Responsive** - Mobile-first design approach

## 🧪 Testing

### Backend Testing
```bash
cd backend
go test ./...
go test -v ./internal/algorithm/...
```

### Frontend Testing
```bash
cd frontend
bun test  # or npm test
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
cd build
docker-compose up --build

# Or build Docker image manually
docker build -t algorthmia .
docker run -p 8080:8080 algorthmia
```

## 📊 Performance

- **Backend**: Sub-millisecond algorithm step generation
- **Frontend**: 60fps smooth animations
- **Memory**: Efficient step-by-step execution without storing all data
- **Bundle Size**: Optimized with tree-shaking and code splitting

## 🔧 Configuration

### Backend Configuration (`config.yaml`)
```yaml
server:
  host: "localhost"
  port: 8080
  read_timeout: 30
  write_timeout: 30

algorithms:
  max_array_size: 100
  default_array_size: 20
  min_array_size: 5
  max_speed: 10
  min_speed: 1
  default_speed: 5
```

### Environment Variables
- `SERVER_HOST` - Server host address
- `SERVER_PORT` - Server port
- `LOG_LEVEL` - Logging level (debug, info, warn, error)

## 🛠️ Development

### Adding New Algorithms

1. **Create algorithm implementation**
   ```go
   // internal/algorithm/sorting/new_algorithm.go
   type NewAlgorithm struct {
       metadata models.Algorithm
   }
   
   func (na *NewAlgorithm) Execute(ctx context.Context, config models.AlgorithmConfig) ([]models.AlgorithmStep, error) {
       // Implementation
   }
   ```

2. **Register in server**
   ```go
   // internal/server/server.go
   newAlg := sorting.NewNewAlgorithm()
   algorithmManager.RegisterAlgorithm(newAlg)
   ```

### Adding New UI Components

1. **Create component**
   ```svelte
   <!-- src/lib/components/NewComponent.svelte -->
   <script lang="ts">
     // Component logic
   </script>
   
   <div class="new-component">
     <!-- Component markup -->
   </div>
   ```

2. **Add to component library**
   ```typescript
   // src/lib/components/index.ts
   export { default as NewComponent } from './NewComponent.svelte';
   ```

## 📈 Roadmap

- [ ] Additional sorting algorithms (Heap Sort, Radix Sort)
- [ ] Graph algorithms (BFS, DFS, Dijkstra)
- [ ] Search algorithms (Binary Search, Linear Search)
- [ ] Algorithm comparison mode
- [ ] Export visualization as GIF/MP4
- [ ] User accounts and saved visualizations
- [ ] Mobile app (React Native/Flutter)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [VisuAlgo](https://visualgo.net/) and [Brilliant.org](https://brilliant.org/)
- Built with modern web technologies and best practices
- Designed for educational purposes and technical demonstrations

---

**Built with ❤️ for the developer community**