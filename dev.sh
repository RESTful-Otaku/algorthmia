#!/bin/bash

# Algorithm Visualizer - Development Script
# Simple script for iterative development and testing

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output
print() {
    echo -e "${BLUE}[DEV]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Function to show help
show_help() {
    echo "Algorithm Visualizer - Development Script"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  backend     - Start backend server only"
    echo "  frontend    - Start frontend dev server only"
    echo "  both        - Start both backend and frontend (default)"
    echo "  test        - Run tests for both backend and frontend"
    echo "  build       - Build both backend and frontend"
    echo "  clean       - Clean build artifacts"
    echo "  logs        - Show logs from running processes"
    echo "  stop        - Stop all running processes"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh              # Start both services"
    echo "  ./dev.sh backend      # Start only backend"
    echo "  ./dev.sh test         # Run all tests"
    echo "  ./dev.sh build        # Build for production"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        print "Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Function to start backend
start_backend() {
    print "Starting backend server..."
    
    if check_port 8080; then
        print_warning "Port 8080 is already in use. Stopping existing process..."
        kill_port 8080
    fi
    
    cd backend
    
    # Check if Go is installed
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed. Please install Go 1.21 or later."
        exit 1
    fi
    
    # Build and run
    print "Building backend..."
    go build -o bin/server cmd/server/main.go
    
    print "Starting backend server on port 8080..."
    ./bin/server &
    BACKEND_PID=$!
    
    # Wait for server to start
    sleep 2
    
    # Test if server is running
    if curl -s http://localhost:8080/api/v1/health > /dev/null 2>&1; then
        print_success "Backend server started successfully (PID: $BACKEND_PID)"
        print "Backend API available at: http://localhost:8080"
    else
        print_error "Failed to start backend server"
        exit 1
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    print "Starting frontend dev server..."
    
    if check_port 5173; then
        print_warning "Port 5173 is already in use. Stopping existing process..."
        kill_port 5173
    fi
    
    cd frontend
    
    # Check if bun is installed, fallback to npm
    if command -v bun &> /dev/null; then
        DEV_CMD="bun run dev"
        INSTALL_CMD="bun install"
    elif command -v npm &> /dev/null; then
        DEV_CMD="npm run dev"
        INSTALL_CMD="npm install"
    else
        print_error "Neither bun nor npm is installed. Please install one of them."
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print "Installing frontend dependencies..."
        $INSTALL_CMD
    fi
    
    print "Starting frontend dev server on port 5173..."
    $DEV_CMD &
    FRONTEND_PID=$!
    
    # Wait for server to start
    sleep 3
    
    print_success "Frontend dev server started (PID: $FRONTEND_PID)"
    print "Frontend available at: http://localhost:5173"
    
    cd ..
}

# Function to run tests
run_tests() {
    print "Running tests..."
    
    # Backend tests
    print "Running backend tests..."
    cd backend
    if go test ./... -v; then
        print_success "Backend tests passed"
    else
        print_error "Backend tests failed"
        exit 1
    fi
    cd ..
    
    # Frontend tests (if available)
    print "Running frontend tests..."
    cd frontend
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        if command -v bun &> /dev/null; then
            bun test
        elif command -v npm &> /dev/null; then
            npm test
        else
            print_warning "No test runner available for frontend"
        fi
    else
        print_warning "No frontend tests configured"
    fi
    cd ..
    
    print_success "All tests completed"
}

# Function to build both
build_both() {
    print "Building both backend and frontend..."
    
    # Build backend
    print "Building backend..."
    cd backend
    go build -ldflags="-s -w" -o bin/server cmd/server/main.go
    print_success "Backend built successfully"
    cd ..
    
    # Build frontend
    print "Building frontend..."
    cd frontend
    if command -v bun &> /dev/null; then
        bun run build
    elif command -v npm &> /dev/null; then
        npm run build
    else
        print_error "No build tool available for frontend"
        exit 1
    fi
    print_success "Frontend built successfully"
    cd ..
    
    print_success "Both backend and frontend built successfully"
}

# Function to clean build artifacts
clean_build() {
    print "Cleaning build artifacts..."
    
    # Clean backend
    if [ -d "backend/bin" ]; then
        rm -rf backend/bin
        print "Cleaned backend build artifacts"
    fi
    
    # Clean frontend
    if [ -d "frontend/.svelte-kit" ]; then
        rm -rf frontend/.svelte-kit
        print "Cleaned frontend build artifacts"
    fi
    
    if [ -d "frontend/node_modules/.vite" ]; then
        rm -rf frontend/node_modules/.vite
        print "Cleaned frontend cache"
    fi
    
    print_success "Build artifacts cleaned"
}

# Function to show logs
show_logs() {
    print "Showing logs from running processes..."
    
    # Check for backend logs
    if check_port 8080; then
        print "Backend server is running on port 8080"
    else
        print "Backend server is not running"
    fi
    
    # Check for frontend logs
    if check_port 5173; then
        print "Frontend server is running on port 5173"
    else
        print "Frontend server is not running"
    fi
}

# Function to stop all processes
stop_all() {
    print "Stopping all running processes..."
    
    # Stop backend
    if check_port 8080; then
        kill_port 8080
        print "Stopped backend server"
    fi
    
    # Stop frontend
    if check_port 5173; then
        kill_port 5173
        print "Stopped frontend server"
    fi
    
    print_success "All processes stopped"
}

# Function to start both services
start_both() {
    print "Starting both backend and frontend..."
    
    start_backend
    start_frontend
    
    print_success "Both services started successfully!"
    print ""
    print "🌐 Application URLs:"
    print "   Frontend: http://localhost:5173"
    print "   Backend API: http://localhost:8080"
    print "   Health Check: http://localhost:8080/api/v1/health"
    print ""
    print "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    trap 'stop_all; exit 0' INT
    wait
}

# Main script logic
case "${1:-both}" in
    "backend")
        start_backend
        print "Backend running. Press Ctrl+C to stop."
        trap 'kill_port 8080; exit 0' INT
        wait
        ;;
    "frontend")
        start_frontend
        print "Frontend running. Press Ctrl+C to stop."
        trap 'kill_port 5173; exit 0' INT
        wait
        ;;
    "both")
        start_both
        ;;
    "test")
        run_tests
        ;;
    "build")
        build_both
        ;;
    "clean")
        clean_build
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_all
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
