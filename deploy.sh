#!/bin/bash

# Algorthmia Deployment Script
# This script handles building, testing, and deploying the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="algorthmia"
CONTAINER_NAME="algorthmia-app"
PORT=${PORT:-80}

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
    fi
    success "Docker is running"
}

# Build the Docker image
build_image() {
    log "Building Docker image..."
    docker build -t $IMAGE_NAME:latest .
    success "Docker image built successfully"
}

# Test the Docker image
test_image() {
    log "Testing Docker image..."
    
    # Start container
    docker run --name ${CONTAINER_NAME}-test -d -p $PORT:80 $IMAGE_NAME:latest
    
    # Wait for container to start
    sleep 10
    
    # Test health endpoint
    if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
        success "Health check passed"
    else
        error "Health check failed"
    fi
    
    # Test main page
    if curl -f http://localhost:$PORT/ > /dev/null 2>&1; then
        success "Main page accessible"
    else
        error "Main page not accessible"
    fi
    
    # Cleanup test container
    docker stop ${CONTAINER_NAME}-test
    docker rm ${CONTAINER_NAME}-test
    success "Container test completed"
}

# Deploy the application
deploy() {
    log "Deploying application..."
    
    # Stop existing container if running
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log "Stopping existing container..."
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
    fi
    
    # Start new container
    docker run --name $CONTAINER_NAME -d -p $PORT:80 \
        -e NODE_ENV=production \
        -e API_BASE_URL=${API_BASE_URL:-https://algorthmia-api.herokuapp.com} \
        $IMAGE_NAME:latest
    
    success "Application deployed successfully"
    log "Application is running at http://localhost:$PORT"
}

# Show logs
show_logs() {
    log "Showing application logs..."
    docker logs -f $CONTAINER_NAME
}

# Stop the application
stop() {
    log "Stopping application..."
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
        success "Application stopped"
    else
        warning "Application is not running"
    fi
}

# Show status
status() {
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        success "Application is running"
        docker ps -f name=$CONTAINER_NAME
    else
        warning "Application is not running"
    fi
}

# Clean up
cleanup() {
    log "Cleaning up..."
    
    # Stop and remove container
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
    fi
    
    # Remove image
    if docker images -q $IMAGE_NAME | grep -q .; then
        docker rmi $IMAGE_NAME:latest
    fi
    
    # Clean up dangling images
    docker image prune -f
    
    success "Cleanup completed"
}

# Main script
main() {
    case "${1:-deploy}" in
        "build")
            check_docker
            build_image
            ;;
        "test")
            check_docker
            build_image
            test_image
            ;;
        "deploy")
            check_docker
            build_image
            test_image
            deploy
            ;;
        "logs")
            show_logs
            ;;
        "stop")
            stop
            ;;
        "status")
            status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  build     Build Docker image"
            echo "  test      Build and test Docker image"
            echo "  deploy    Build, test, and deploy application (default)"
            echo "  logs      Show application logs"
            echo "  stop      Stop application"
            echo "  status    Show application status"
            echo "  cleanup   Clean up containers and images"
            echo "  help      Show this help message"
            echo ""
            echo "Environment variables:"
            echo "  PORT              Port to run on (default: 80)"
            echo "  API_BASE_URL      Backend API URL"
            ;;
        *)
            error "Unknown command: $1. Use 'help' for usage information."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
