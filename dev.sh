#!/bin/bash

# Algorthmia Development Script
# Simple, clean development workflow

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Functions
log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}✅${NC} $1"; }
warning() { echo -e "${YELLOW}⚠️${NC} $1"; }
error() { echo -e "${RED}❌${NC} $1"; exit 1; }

# Check if command exists
command_exists() { command -v "$1" >/dev/null 2>&1; }

# Kill process on port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pids" ]; then
        echo $pids | xargs kill 2>/dev/null || true
        sleep 1
        echo $pids | xargs kill -9 2>/dev/null || true
    fi
}

# Install dependencies
install() {
    log "Installing dependencies..."
    
    # Frontend
    cd frontend
    if command_exists npm; then
        npm install
    else
        error "npm not found. Please install Node.js 20+"
    fi
    cd ..
    
    # Backend
    cd backend
    if command_exists go; then
        go mod download
        go mod tidy
    else
        error "Go not found. Please install Go 1.23+"
    fi
    cd ..
    
    success "Dependencies installed"
}

# Start backend
backend() {
    log "Starting backend server..."
    cd backend
    go run ./cmd/server &
    BACKEND_PID=$!
    echo $BACKEND_PID > .backend.pid
    cd ..
    success "Backend started (PID: $BACKEND_PID)"
}

# Start frontend
frontend() {
    log "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > .frontend.pid
    cd ..
    success "Frontend started (PID: $FRONTEND_PID)"
}

# Start everything
start() {
    log "Starting Algorthmia development environment..."
    
    # Kill existing processes
    kill_port 8080
    kill_port 5173
    
    # Install dependencies
    install
    
    # Start backend
    backend
    sleep 2
    
    # Start frontend
    frontend
    
    success "Development environment ready!"
    log "Backend: http://localhost:8080"
    log "Frontend: http://localhost:5173"
    log "Press Ctrl+C to stop"
    
    # Wait for interrupt
    trap cleanup INT
    wait
}

# Stop everything
stop() {
    log "Stopping development environment..."
    
    # Stop backend
    if [ -f "backend/.backend.pid" ]; then
        BACKEND_PID=$(cat backend/.backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm -f backend/.backend.pid
    fi
    
    # Stop frontend
    if [ -f "frontend/.frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend/.frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm -f frontend/.frontend.pid
    fi
    
    # Kill any remaining processes
    kill_port 8080
    kill_port 5173
    
    success "Development environment stopped"
}

# Cleanup function
cleanup() {
    stop
    exit 0
}

# Test everything
test() {
    log "Running tests..."
    
    # Backend tests
    cd backend
    go test ./...
    cd ..
    
    # Frontend tests
    cd frontend
    npm run test
    cd ..
    
    success "All tests passed"
}

# Build for production
build() {
    log "Building for production..."
    
    # Build frontend
    cd frontend
    npm run build
    cd ..
    
    # Build backend
    cd backend
    go build -o main ./cmd/server
    cd ..
    
    success "Production build complete"
}

# Deploy to Fly.io
deploy() {
    log "Deploying to Fly.io..."
    
    if ! command_exists flyctl; then
        error "flyctl not found. Please install it from https://fly.io/docs/hands-on/install-flyctl/"
    fi
    
    # Check if authenticated
    if ! flyctl auth whoami &> /dev/null; then
        error "Not logged in to Fly.io. Please run 'flyctl auth login' first"
    fi
    
    # Deploy
    flyctl deploy --dockerfile Dockerfile.fly
    
    success "Deployed to Fly.io"
}

# Show help
help() {
    echo "Algorthmia Development Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start development environment (default)"
    echo "  stop      - Stop development environment"
    echo "  install   - Install dependencies"
    echo "  test      - Run tests"
    echo "  build     - Build for production"
    echo "  deploy    - Deploy to Fly.io"
    echo "  help      - Show this help"
    echo ""
    echo "Examples:"
    echo "  $0              # Start development environment"
    echo "  $0 test         # Run tests"
    echo "  $0 deploy       # Deploy to Fly.io"
}

# Main script
case "${1:-start}" in
    "start"|"")
        start
        ;;
    "stop")
        stop
        ;;
    "install")
        install
        ;;
    "test")
        test
        ;;
    "build")
        build
        ;;
    "deploy")
        deploy
        ;;
    "help"|"-h"|"--help")
        help
        ;;
    *)
        error "Unknown command: $1. Use 'help' for usage information."
        ;;
esac