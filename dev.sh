#!/bin/bash

# Simple development script for Algorithm Visualizer

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main functions
start_backend() {
    print_info "Starting backend server..."
    cd backend
    if command_exists go; then
        go run ./cmd/server
    else
        print_warning "Go not found. Please install Go 1.21+"
        exit 1
    fi
}

start_frontend() {
    print_info "Starting frontend development server..."
    cd frontend
    if command_exists npm; then
        npm run dev
    elif command_exists bun; then
        bun run dev
    else
        print_warning "Neither npm nor bun found. Please install Node.js 18+"
        exit 1
    fi
}

build_all() {
    print_info "Building application..."
    
    # Build frontend
    print_info "Building frontend..."
    cd frontend
    if command_exists npm; then
        npm run build
    elif command_exists bun; then
        bun run build
    else
        print_warning "Neither npm nor bun found. Please install Node.js 18+"
        exit 1
    fi
    cd ..
    
    # Build backend
    print_info "Building backend..."
    cd backend
    if command_exists go; then
        go build -o main ./cmd/server
        print_success "Backend built successfully"
    else
        print_warning "Go not found. Please install Go 1.21+"
        exit 1
    fi
    cd ..
    
    print_success "Build completed!"
}

test_all() {
    print_info "Running tests..."
    
    # Test backend
    print_info "Testing backend..."
    cd backend
    if command_exists go; then
        go test ./...
        print_success "Backend tests passed"
    else
        print_warning "Go not found. Skipping backend tests"
    fi
    cd ..
    
    # Test frontend
    print_info "Testing frontend..."
    cd frontend
    if command_exists npm; then
        npm run test
        print_success "Frontend tests passed"
    elif command_exists bun; then
        bun run test
        print_success "Frontend tests passed"
    else
        print_warning "Neither npm nor bun found. Skipping frontend tests"
    fi
    cd ..
    
    print_success "All tests completed!"
}

docker_build() {
    print_info "Building Docker image..."
    if command_exists docker; then
        docker build -t algorthmia .
        print_success "Docker image built successfully"
    else
        print_warning "Docker not found. Please install Docker"
        exit 1
    fi
}

docker_run() {
    print_info "Running with Docker Compose..."
    if command_exists docker-compose; then
        docker-compose up --build
    elif command_exists docker && docker compose version >/dev/null 2>&1; then
        docker compose up --build
    else
        print_warning "Docker Compose not found. Please install Docker Compose"
        exit 1
    fi
}

clean() {
    print_info "Cleaning build artifacts..."
    
    # Clean frontend
    if [ -d "frontend/dist" ]; then
        rm -rf frontend/dist
        print_info "Removed frontend/dist"
    fi
    
    # Clean backend
    if [ -f "backend/main" ]; then
        rm -f backend/main
        print_info "Removed backend/main"
    fi
    
    # Clean Docker
    if command_exists docker; then
        docker system prune -f
        print_info "Cleaned Docker cache"
    fi
    
    print_success "Cleanup completed!"
}

show_help() {
    echo "Algorithm Visualizer - Development Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  backend     - Start backend server"
    echo "  frontend    - Start frontend development server"
    echo "  build       - Build both frontend and backend"
    echo "  test        - Run all tests"
    echo "  docker      - Build Docker image"
    echo "  run         - Run with Docker Compose"
    echo "  clean       - Clean build artifacts"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 backend     # Start backend only"
    echo "  $0 frontend    # Start frontend only"
    echo "  $0 build       # Build everything"
    echo "  $0 test        # Run tests"
    echo "  $0 docker      # Build Docker image"
    echo "  $0 run         # Run with Docker"
    echo "  $0 clean       # Clean up"
}

# Main script logic
case "${1:-help}" in
    "backend")
        start_backend
        ;;
    "frontend")
        start_frontend
        ;;
    "build")
        build_all
        ;;
    "test")
        test_all
        ;;
    "docker")
        docker_build
        ;;
    "run")
        docker_run
        ;;
    "clean")
        clean
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_warning "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
