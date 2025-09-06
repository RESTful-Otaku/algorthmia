#!/bin/bash

# Algorthmia Deployment Script
# Simple Fly.io deployment

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

# Check if flyctl is installed
check_flyctl() {
    if ! command -v flyctl &> /dev/null; then
        error "flyctl not found. Please install it from https://fly.io/docs/hands-on/install-flyctl/"
    fi
}

# Check if authenticated
check_auth() {
    if ! flyctl auth whoami &> /dev/null; then
        error "Not logged in to Fly.io. Please run 'flyctl auth login' first"
    fi
}

# Build and test locally
build_and_test() {
    log "Building Docker image..."
    docker build -f Dockerfile.fly -t algorthmia:fly .
    success "Docker image built"
    
    log "Testing locally..."
    docker run --name algorthmia-test -d -p 80:80 algorthmia:fly
    sleep 5
    
    if curl -f http://localhost/health > /dev/null 2>&1; then
        success "Health check passed"
    else
        error "Health check failed"
    fi
    
    if curl -f http://localhost/ > /dev/null 2>&1; then
        success "Main page accessible"
    else
        error "Main page not accessible"
    fi
    
    docker stop algorthmia-test
    docker rm algorthmia-test
    success "Local test completed"
}

# Deploy to Fly.io
deploy() {
    log "Deploying to Fly.io..."
    flyctl deploy --dockerfile Dockerfile.fly
    success "Deployed to Fly.io"
}

# Show app info
info() {
    log "Getting app information..."
    flyctl info
    flyctl status
}

# Show logs
logs() {
    log "Showing app logs..."
    flyctl logs
}

# Scale app
scale() {
    local instances=${1:-1}
    log "Scaling to $instances instances..."
    flyctl scale count $instances
    success "Scaled to $instances instances"
}

# Open app
open() {
    log "Opening app in browser..."
    flyctl open
}

# Set environment variables
set_env() {
    local key=$1
    local value=$2
    
    if [ -z "$key" ] || [ -z "$value" ]; then
        error "Usage: set_env <key> <value>"
    fi
    
    log "Setting $key..."
    flyctl secrets set $key="$value"
    success "Environment variable set"
}

# Show help
help() {
    echo "Algorthmia Deployment Script"
    echo ""
    echo "Usage: $0 [command] [args...]"
    echo ""
    echo "Commands:"
    echo "  deploy     - Deploy to Fly.io (default)"
    echo "  build      - Build and test locally"
    echo "  info       - Show app information"
    echo "  logs       - Show app logs"
    echo "  scale N    - Scale to N instances"
    echo "  open       - Open app in browser"
    echo "  set-env    - Set environment variable"
    echo "  help       - Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 deploy                    # Deploy to Fly.io"
    echo "  $0 build                     # Build and test locally"
    echo "  $0 scale 3                   # Scale to 3 instances"
    echo "  $0 set-env API_URL https://api.example.com"
}

# Main script
case "${1:-deploy}" in
    "deploy")
        check_flyctl
        check_auth
        build_and_test
        deploy
        ;;
    "build")
        build_and_test
        ;;
    "info")
        check_flyctl
        check_auth
        info
        ;;
    "logs")
        check_flyctl
        check_auth
        logs
        ;;
    "scale")
        check_flyctl
        check_auth
        scale $2
        ;;
    "open")
        check_flyctl
        check_auth
        open
        ;;
    "set-env")
        check_flyctl
        check_auth
        set_env $2 $3
        ;;
    "help"|"-h"|"--help")
        help
        ;;
    *)
        error "Unknown command: $1. Use 'help' for usage information."
        ;;
esac
