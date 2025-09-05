# Algorithm Visualizer

A modern, interactive web application for visualizing sorting algorithms with real-time step-by-step animations.

## 🚀 Quick Start

### Development

```bash
# Start backend server
./dev.sh backend

# Start frontend development server (in another terminal)
./dev.sh frontend

# Or run both with Docker
./dev.sh run
```

### Building

```bash
# Build everything
./dev.sh build

# Build Docker image
./dev.sh docker
```

### Testing

```bash
# Run all tests
./dev.sh test
```

## 🐳 Docker Deployment

The application is containerized using Alpine Linux for minimal size and security.

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build Docker image manually
docker build -t algorthmia .
docker run -p 8080:8080 algorthmia
```

## 🌐 GitHub Pages Deployment

The application automatically deploys to GitHub Pages when you push to the `main` branch.

1. Enable GitHub Pages in your repository settings
2. Set source to "GitHub Actions"
3. Push to `main` branch
4. The workflow will build and deploy automatically

## 🏗️ Architecture

### Backend (Go)
- **Framework:** Gin HTTP framework
- **Algorithms:** Sorting algorithms with step-by-step execution
- **API:** RESTful API with CORS support
- **Security:** Input validation, rate limiting, security headers

### Frontend (Svelte)
- **Framework:** Svelte 5 with TypeScript
- **Styling:** Tailwind CSS
- **Build:** Vite
- **Testing:** Vitest

### Features
- **Real-time Visualization:** Step-by-step algorithm execution
- **Interactive Controls:** Play, pause, stop, speed control
- **Multiple Algorithms:** Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- **Responsive Design:** Works on desktop and mobile
- **Dark/Light Theme:** User preference support
- **Accessibility:** WCAG compliant

## 📁 Project Structure

```
├── backend/                 # Go backend
│   ├── cmd/server/         # Main application
│   ├── internal/           # Internal packages
│   │   ├── algorithm/      # Algorithm implementations
│   │   ├── api/           # HTTP handlers
│   │   ├── config/        # Configuration
│   │   ├── middleware/    # HTTP middleware
│   │   └── models/        # Data models
│   └── config.yaml        # Configuration file
├── frontend/               # Svelte frontend
│   ├── src/               # Source code
│   │   ├── lib/           # Libraries and utilities
│   │   ├── routes/        # SvelteKit routes
│   │   └── test/          # Test utilities
│   └── package.json       # Dependencies
├── .github/workflows/     # GitHub Actions
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
└── dev.sh                 # Development script
```

## 🛠️ Development

### Prerequisites
- **Go 1.21+** for backend development
- **Node.js 18+** or **Bun** for frontend development
- **Docker** for containerized deployment

### Available Scripts

```bash
./dev.sh backend     # Start backend server
./dev.sh frontend    # Start frontend dev server
./dev.sh build       # Build both frontend and backend
./dev.sh test        # Run all tests
./dev.sh docker      # Build Docker image
./dev.sh run         # Run with Docker Compose
./dev.sh clean       # Clean build artifacts
./dev.sh help        # Show help
```

### API Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/algorithms` - List all algorithms
- `GET /api/v1/algorithms/:id` - Get specific algorithm
- `GET /api/v1/algorithms/:id/config` - Get algorithm configuration
- `POST /api/v1/algorithms/:id/execute` - Execute algorithm

## 🎯 Algorithms

### Sorting Algorithms
- **Bubble Sort** - Simple comparison-based sorting
- **Selection Sort** - Finds minimum element and places it
- **Insertion Sort** - Builds sorted array one element at a time
- **Merge Sort** - Divide and conquer approach
- **Quick Sort** - Partition-based sorting

Each algorithm includes:
- Step-by-step visualization
- Time and space complexity information
- Interactive controls
- Educational descriptions

## 🔧 Configuration

The application can be configured via `backend/config.yaml`:

```yaml
server:
  host: "0.0.0.0"
  port: 8080
  read_timeout: 30
  write_timeout: 30

logging:
  level: "info"
  format: "text"

cors:
  allowed_origins: ["*"]
  allowed_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  allowed_headers: ["Origin", "Content-Type", "Accept", "Authorization"]

algorithms:
  max_array_size: 1000
  default_array_size: 20
  min_array_size: 1
  max_speed: 10
  min_speed: 1
  default_speed: 5
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.