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

# Check if port is in use
port_in_use() {
    local port=$1
    if command_exists lsof; then
        lsof -ti:$port >/dev/null 2>&1
    elif command_exists netstat; then
        netstat -tuln | grep -q ":$port "
    elif command_exists ss; then
        ss -tuln | grep -q ":$port "
    else
        return 1
    fi
}

# Kill process on port
kill_port() {
    local port=$1
    local pids=""
    
    if command_exists lsof; then
        pids=$(lsof -ti:$port 2>/dev/null || true)
    elif command_exists netstat; then
        pids=$(netstat -tulnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | grep -v '-' || true)
    elif command_exists ss; then
        pids=$(ss -tulnp 2>/dev/null | grep ":$port " | awk '{print $6}' | cut -d',' -f2 | cut -d'=' -f2 | grep -v '-' || true)
    fi
    
    if [ ! -z "$pids" ]; then
        echo $pids | xargs kill 2>/dev/null || true
        sleep 1
        echo $pids | xargs kill -9 2>/dev/null || true
        return 0
    fi
    return 1
}

# Check and install frontend dependencies
ensure_frontend_deps() {
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_info "Frontend dependencies not found. Installing..."
        if command_exists npm; then
            npm install
        elif command_exists bun; then
            bun install
        else
            print_warning "Neither npm nor bun found. Please install Node.js 18+"
            exit 1
        fi
        print_success "Frontend dependencies installed"
    else
        print_info "Frontend dependencies already installed"
    fi
    
    cd ..
}

# Check and install backend dependencies
ensure_backend_deps() {
    cd backend
    
    # Check if go.mod exists and download dependencies
    if [ -f "go.mod" ]; then
        print_info "Ensuring backend dependencies are up to date..."
        if command_exists go; then
            go mod download
            go mod tidy
            print_success "Backend dependencies ready"
        else
            print_warning "Go not found. Please install Go 1.21+"
            exit 1
        fi
    else
        print_warning "go.mod not found in backend directory"
        exit 1
    fi
    
    cd ..
}

# Main functions
start_backend() {
    print_info "Starting backend server..."
    ensure_backend_deps
    cd backend
    if command_exists go; then
        go run ./cmd/server
    else
        print_warning "Go not found. Please install Go 1.21+"
        exit 1
    fi
}

start_backend_bg() {
    print_info "Starting backend server in background..."
    ensure_backend_deps
    cd backend
    if command_exists go; then
        go run ./cmd/server &
        BACKEND_PID=$!
        print_success "Backend started with PID: $BACKEND_PID"
        echo $BACKEND_PID > .backend.pid
        cd ..
    else
        print_warning "Go not found. Please install Go 1.21+"
        exit 1
    fi
}

start_frontend() {
    print_info "Starting frontend development server..."
    ensure_frontend_deps
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

start_all() {
    print_info "Starting Algorithm Visualizer (Backend + Frontend)..."
    print_info "Press Ctrl+C to stop both services"
    
    # Start backend in background
    start_backend_bg
    
    # Wait a moment for backend to start
    print_info "Waiting for backend to initialize..."
    sleep 3
    
    # Check if backend is running
    if [ -f "backend/.backend.pid" ]; then
        BACKEND_PID=$(cat backend/.backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_success "Backend is running on http://localhost:8080"
        else
            print_warning "Backend failed to start"
            exit 1
        fi
    else
        print_warning "Backend PID file not found"
        exit 1
    fi
    
    # Start frontend (this will block)
    print_info "Starting frontend development server..."
    ensure_frontend_deps
    cd frontend
    if command_exists npm; then
        npm run dev
    elif command_exists bun; then
        bun run dev
    else
        print_warning "Neither npm nor bun found. Please install Node.js 18+"
        # Clean up backend if frontend fails
        if [ -f "../backend/.backend.pid" ]; then
            BACKEND_PID=$(cat ../backend/.backend.pid)
            kill $BACKEND_PID 2>/dev/null
            rm -f ../backend/.backend.pid
        fi
        exit 1
    fi
}

cleanup() {
    print_info "Cleaning up processes and resources..."
    
    # Clean up backend process
    if [ -f "backend/.backend.pid" ]; then
        BACKEND_PID=$(cat backend/.backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_info "Stopping backend (PID: $BACKEND_PID)..."
            kill $BACKEND_PID 2>/dev/null
            sleep 1
            # Force kill if still running
            if kill -0 $BACKEND_PID 2>/dev/null; then
                print_info "Force stopping backend..."
                kill -9 $BACKEND_PID 2>/dev/null
            fi
            rm -f backend/.backend.pid
            print_success "Backend stopped"
        else
            rm -f backend/.backend.pid
        fi
    fi
    
    # Kill any remaining processes on our ports
    print_info "Checking for processes on ports 8080 and 5173..."
    
    # Kill processes on port 8080 (backend)
    if port_in_use 8080; then
        print_info "Killing process on port 8080..."
        if kill_port 8080; then
            print_success "Port 8080 freed"
        else
            print_warning "Could not free port 8080"
        fi
    fi
    
    # Kill processes on port 5173 (frontend)
    if port_in_use 5173; then
        print_info "Killing process on port 5173..."
        if kill_port 5173; then
            print_success "Port 5173 freed"
        else
            print_warning "Could not free port 5173"
        fi
    fi
    
    # Kill any remaining Go processes that might be our backend
    GO_PIDS=$(pgrep -f "go run.*cmd/server" 2>/dev/null || true)
    if [ ! -z "$GO_PIDS" ]; then
        print_info "Killing remaining Go server processes..."
        echo $GO_PIDS | xargs kill 2>/dev/null || true
        sleep 1
        echo $GO_PIDS | xargs kill -9 2>/dev/null || true
    fi
    
    # Kill any remaining Node.js processes that might be our frontend
    NODE_PIDS=$(pgrep -f "vite.*dev" 2>/dev/null || true)
    if [ ! -z "$NODE_PIDS" ]; then
        print_info "Killing remaining Vite dev processes..."
        echo $NODE_PIDS | xargs kill 2>/dev/null || true
        sleep 1
        echo $NODE_PIDS | xargs kill -9 2>/dev/null || true
    fi
    
    # Clean up any temporary files
    rm -f backend/.backend.pid
    rm -f .dev.pid 2>/dev/null || true
    
    print_success "Cleanup completed - all processes and ports freed"
}

build_all() {
    print_info "Building application..."
    
    # Build frontend
    print_info "Building frontend..."
    ensure_frontend_deps
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
    ensure_backend_deps
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
    ensure_backend_deps
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
    ensure_frontend_deps
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

docker_deploy() {
    print_info "Deploying with Docker..."
    if command_exists docker; then
        ./deploy.sh deploy
    else
        print_warning "Docker not found. Please install Docker"
        exit 1
    fi
}

docker_test() {
    print_info "Testing Docker deployment..."
    if command_exists docker; then
        ./deploy.sh test
    else
        print_warning "Docker not found. Please install Docker"
        exit 1
    fi
}

install_deps() {
    print_info "Installing all dependencies..."
    
    # Install frontend dependencies
    ensure_frontend_deps
    
    # Install backend dependencies
    ensure_backend_deps
    
    print_success "All dependencies installed!"
}

# Enhanced signal handling
setup_signal_handlers() {
    # Function to handle cleanup on various signals
    handle_cleanup() {
        local signal=$1
        print_info "Received signal $signal - cleaning up..."
        cleanup
        exit 0
    }
    
    # Set up traps for different signals
    trap 'handle_cleanup SIGINT' INT
    trap 'handle_cleanup SIGTERM' TERM
    trap 'handle_cleanup SIGQUIT' QUIT
    trap 'handle_cleanup SIGEXIT' EXIT
    trap 'handle_cleanup SIGHUP' HUP
}

# Set up signal handlers
setup_signal_handlers

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

stop_all() {
    print_info "Stopping all running processes and freeing ports..."
    cleanup
}

show_help() {
    echo "Algorithm Visualizer - Development Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  (no args)   - Start both backend and frontend (default)"
    echo "  install     - Install all dependencies"
    echo "  backend     - Start backend server only"
    echo "  frontend    - Start frontend development server only"
    echo "  build       - Build both frontend and backend"
    echo "  test        - Run all tests"
    echo "  stop        - Stop all running processes and free ports"
    echo "  docker      - Build Docker image"
    echo "  run         - Run with Docker Compose"
    echo "  deploy      - Deploy with Docker"
    echo "  test-docker - Test Docker deployment"
    echo "  clean       - Clean build artifacts"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Start everything (backend + frontend)"
    echo "  $0 install      # Install dependencies first"
    echo "  $0 backend      # Start backend only"
    echo "  $0 frontend     # Start frontend only"
    echo "  $0 build        # Build everything"
    echo "  $0 test         # Run tests"
    echo "  $0 stop         # Stop all processes and free ports"
    echo "  $0 docker       # Build Docker image"
    echo "  $0 run          # Run with Docker"
    echo "  $0 clean        # Clean up"
    echo ""
    echo "Quick Start:"
    echo "  $0              # Just run this to start the app locally!"
    echo "  Ctrl+C          # Stop everything and clean up automatically"
    echo ""
    echo "Auto Cleanup:"
    echo "  The script automatically cleans up processes and ports when:"
    echo "  - You press Ctrl+C"
    echo "  - The script is terminated"
    echo "  - You run './dev.sh stop'"
}

# Main script logic
case "${1:-start}" in
    "start"|"")
        start_all
        ;;
    "install")
        install_deps
        ;;
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
    "stop")
        stop_all
        ;;
    "docker")
        docker_build
        ;;
    "run")
        docker_run
        ;;
    "deploy")
        docker_deploy
        ;;
    "test-docker")
        docker_test
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
