# 🧮 Algorthmia

**Interactive Algorithm Visualization Platform**

A modern, full-stack web application for visualizing algorithms with real-time step-by-step animations. Built with SvelteKit, Go, and deployed on Fly.io.

[![CI](https://github.com/yourusername/algorthmia/workflows/CI/badge.svg)](https://github.com/yourusername/algorthmia/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🎯 Interactive Visualizations** - Step-by-step algorithm animations
- **🚀 Real-time Controls** - Play, pause, step through, and scrub
- **🎨 Modern UI** - Beautiful, responsive design with dark/light themes
- **📱 Mobile Ready** - Optimized for all device sizes
- **⚡ Fast Performance** - Optimized rendering and smooth animations
- **🔧 Customizable** - Adjustable parameters and grid sizes
- **🌍 Global Deployment** - Deployed on Fly.io edge network

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Deployment    │
│   (SvelteKit)   │◄──►│   (Go/Gin)      │    │   (Fly.io)      │
│                 │    │                 │    │                 │
│ • Svelte 5      │    │ • REST API      │    │ • Docker        │
│ • TypeScript    │    │ • Algorithm     │    │ • Edge Network  │
│ • Tailwind CSS  │    │   Execution     │    │ • Auto-scaling  │
│ • Vite          │    │ • Step Tracking │    │ • SSL/TLS       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** - [Download](https://nodejs.org/)
- **Go 1.23+** - [Download](https://golang.org/dl/)
- **Docker** - [Download](https://www.docker.com/)

### Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/algorthmia.git
   cd algorthmia
   ```

2. **Start development environment**
   ```bash
   ./dev.sh
   ```

3. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080

### Available Commands

```bash
# Development
./dev.sh              # Start development environment
./dev.sh stop         # Stop development environment
./dev.sh test         # Run tests
./dev.sh build        # Build for production

# Deployment
./deploy.sh           # Deploy to Fly.io
./deploy.sh build     # Build and test locally
./deploy.sh logs      # View deployment logs
./deploy.sh scale 3   # Scale to 3 instances
```

## 🛠️ Development

### Project Structure

```
algorthmia/
├── frontend/                 # SvelteKit frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/   # Reusable components
│   │   │   └── stores/       # State management
│   │   └── routes/           # Pages and layouts
│   ├── static/               # Static assets
│   └── package.json
├── backend/                  # Go backend
│   ├── cmd/server/           # Main application
│   ├── internal/
│   │   ├── algorithm/        # Algorithm implementations
│   │   ├── models/           # Data models
│   │   └── server/           # HTTP server
│   └── go.mod
├── .github/workflows/        # CI/CD
├── Dockerfile.fly           # Production Docker image
├── fly.toml                 # Fly.io configuration
├── dev.sh                   # Development script
└── deploy.sh                # Deployment script
```

### Technology Stack

**Frontend:**
- **SvelteKit** - Modern web framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Build tool and dev server

**Backend:**
- **Go 1.23** - High-performance language
- **Gin** - HTTP web framework
- **CORS** - Cross-origin resource sharing

**Deployment:**
- **Fly.io** - Global edge platform
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

## 🚀 Deployment

### Fly.io Deployment

1. **Install flyctl**
   ```bash
   curl -L https://fly.io/install.sh | sh
   export PATH="$HOME/.fly/bin:$PATH"
   ```

2. **Login to Fly.io**
   ```bash
   flyctl auth login
   ```

3. **Deploy**
   ```bash
   ./deploy.sh
   ```

### Environment Variables

Set environment variables for production:

```bash
# Set API base URL
./deploy.sh set-env API_BASE_URL https://your-api.com

# Set other variables
flyctl secrets set NODE_ENV=production
```

### Scaling

```bash
# Scale to multiple instances
./deploy.sh scale 3

# Check status
./deploy.sh info
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
./dev.sh test

# Run frontend tests only
cd frontend && npm test

# Run backend tests only
cd backend && go test ./...
```

### Test Coverage

The project includes comprehensive tests for:
- Frontend components and stores
- Backend API endpoints
- Algorithm implementations
- Integration tests

## 📊 Performance

### Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

### Optimization

- **Code Splitting** - Automatic bundle optimization
- **Tree Shaking** - Remove unused code
- **Image Optimization** - WebP format with fallbacks
- **Caching** - Aggressive caching strategies
- **CDN** - Global content delivery

## 🔧 Configuration

### Frontend Configuration

```typescript
// frontend/vite.config.ts
export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
```

### Backend Configuration

```go
// backend/internal/server/server.go
func NewServer() *gin.Engine {
    r := gin.Default()
    r.Use(cors.Default())
    r.GET("/api/v1/algorithms", getAlgorithms)
    r.POST("/api/v1/execute", executeAlgorithm)
    return r
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   ./dev.sh test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SvelteKit** - Amazing web framework
- **Go** - Powerful backend language
- **Fly.io** - Excellent deployment platform
- **Tailwind CSS** - Beautiful styling
- **Vite** - Fast build tool

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/yourusername/algorthmia/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/algorthmia/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/algorthmia/discussions)

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**