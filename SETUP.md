# 🚀 Setup Guide

Quick setup instructions for Algorthmia development and deployment.

## 📋 Prerequisites

- **Node.js 20+** - [Download](https://nodejs.org/)
- **Go 1.23+** - [Download](https://golang.org/dl/)
- **Docker** - [Download](https://www.docker.com/)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/algorthmia.git
cd algorthmia
```

### 2. Start Development

```bash
# Make scripts executable
chmod +x dev.sh deploy.sh

# Start development environment
./dev.sh
```

### 3. Access Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080

## 🚀 Production Deployment

### 1. Install Fly.io CLI

```bash
curl -L https://fly.io/install.sh | sh
export PATH="$HOME/.fly/bin:$PATH"
```

### 2. Login to Fly.io

```bash
flyctl auth login
```

### 3. Deploy

```bash
./deploy.sh
```

## 🧪 Testing

```bash
# Run all tests
./dev.sh test

# Run specific tests
cd frontend && npm test
cd backend && go test ./...
```

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes on ports 8080 and 5173
lsof -ti:8080 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**Dependencies not found:**
```bash
# Install dependencies
./dev.sh install
```

**Docker build fails:**
```bash
# Clean Docker cache
docker system prune -a
```

### Getting Help

- Check the [README](README.md) for detailed documentation
- Open an [issue](https://github.com/yourusername/algorthmia/issues) for bugs
- Start a [discussion](https://github.com/yourusername/algorthmia/discussions) for questions

## 📚 Next Steps

1. **Explore the codebase** - Check out the project structure
2. **Run the tests** - Ensure everything works
3. **Make changes** - Start developing your features
4. **Deploy** - Push your changes to production

Happy coding! 🎉