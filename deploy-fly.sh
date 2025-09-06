#!/bin/bash

# Fly.io Deployment Script for Algorthmia
# This script handles building, testing, and deploying to Fly.io

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="algorthmia"
DOCKERFILE="Dockerfile.fly"

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

# Check if flyctl is installed
check_flyctl() {
    if ! command -v flyctl &> /dev/null; then
        error "flyctl is not installed. Please install it from https://fly.io/docs/hands-on/install-flyctl/"
    fi
    success "flyctl is installed"
}

# Check if user is logged in
check_auth() {
    if ! flyctl auth whoami &> /dev/null; then
        error "Not logged in to Fly.io. Please run 'flyctl auth login' first"
    fi
    success "Authenticated with Fly.io"
}

# Initialize Fly.io app
init_app() {
    log "Initializing Fly.io app..."
    
    if [ ! -f "fly.toml" ]; then
        log "Creating fly.toml configuration..."
        flyctl launch --no-deploy --name $APP_NAME
    else
        log "fly.toml already exists"
    fi
    
    success "Fly.io app initialized"
}

# Build and test locally
build_and_test() {
    log "Building Docker image for Fly.io..."
    docker build -f $DOCKERFILE -t $APP_NAME:fly .
    success "Docker image built successfully"
    
    log "Testing Docker image locally..."
    docker run --name ${APP_NAME}-test -d -p 80:80 $APP_NAME:fly
    
    # Wait for container to start
    sleep 10
    
    # Test health endpoint
    if curl -f http://localhost:80/health > /dev/null 2>&1; then
        success "Health check passed"
    else
        error "Health check failed"
    fi
    
    # Test main page
    if curl -f http://localhost:80/ > /dev/null 2>&1; then
        success "Main page accessible"
    else
        error "Main page not accessible"
    fi
    
    # Cleanup test container
    docker stop ${APP_NAME}-test
    docker rm ${APP_NAME}-test
    success "Local test completed"
}

# Deploy to Fly.io
deploy() {
    log "Deploying to Fly.io..."
    
    # Deploy the app
    flyctl deploy --dockerfile $DOCKERFILE
    
    success "Deployed to Fly.io successfully"
    
    # Get app info
    log "Getting app information..."
    flyctl info
    
    # Get app URL
    APP_URL=$(flyctl info --json | jq -r '.Hostname')
    if [ "$APP_URL" != "null" ]; then
        success "App is available at: https://$APP_URL"
    fi
}

# Set environment variables
set_env() {
    local key=$1
    local value=$2
    
    if [ -z "$key" ] || [ -z "$value" ]; then
        error "Usage: set_env <key> <value>"
    fi
    
    log "Setting environment variable: $key"
    flyctl secrets set $key="$value"
    success "Environment variable set"
}

# Show app status
status() {
    log "Getting app status..."
    flyctl status
    
    log "Getting app logs..."
    flyctl logs --lines 20
}

# Scale the app
scale() {
    local instances=${1:-1}
    
    log "Scaling app to $instances instances..."
    flyctl scale count $instances
    success "App scaled to $instances instances"
}

# Open app in browser
open() {
    log "Opening app in browser..."
    flyctl open
}

# Show help
show_help() {
    echo "Fly.io Deployment Script for Algorthmia"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  init        - Initialize Fly.io app"
    echo "  build       - Build and test locally"
    echo "  deploy      - Deploy to Fly.io"
    echo "  status      - Show app status and logs"
    echo "  scale N     - Scale app to N instances"
    echo "  open        - Open app in browser"
    echo "  set-env     - Set environment variable (interactive)"
    echo "  logs        - Show app logs"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 init                    # Initialize Fly.io app"
    echo "  $0 build                   # Build and test locally"
    echo "  $0 deploy                  # Deploy to Fly.io"
    echo "  $0 scale 3                 # Scale to 3 instances"
    echo "  $0 set-env                 # Set environment variables"
    echo "  $0 status                  # Check app status"
    echo "  $0 open                    # Open in browser"
    echo ""
    echo "Prerequisites:"
    echo "  - flyctl installed and authenticated"
    echo "  - Docker installed and running"
    echo "  - App initialized with 'flyctl launch'"
}

# Set environment variables interactively
set_env_interactive() {
    echo "Setting environment variables for Fly.io app: $APP_NAME"
    echo ""
    
    read -p "API Base URL (press Enter to skip): " api_url
    if [ ! -z "$api_url" ]; then
        set_env "API_BASE_URL" "$api_url"
    fi
    
    read -p "Node Environment (press Enter for 'production'): " node_env
    node_env=${node_env:-production}
    set_env "NODE_ENV" "$node_env"
    
    success "Environment variables configured"
}

# Show logs
show_logs() {
    log "Showing app logs..."
    flyctl logs --follow
}

# Main script
main() {
    case "${1:-help}" in
        "init")
            check_flyctl
            check_auth
            init_app
            ;;
        "build")
            check_flyctl
            build_and_test
            ;;
        "deploy")
            check_flyctl
            check_auth
            build_and_test
            deploy
            ;;
        "status")
            check_flyctl
            check_auth
            status
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
            set_env_interactive
            ;;
        "logs")
            check_flyctl
            check_auth
            show_logs
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Unknown command: $1. Use 'help' for usage information."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
