#!/bin/bash

# Algorithm Visualizer - Frontend Test Script
# Simple script to test frontend functionality

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
FRONTEND_URL="http://localhost:5173"
TIMEOUT=10

# Function to print colored output
print() {
    echo -e "${BLUE}[FRONTEND-TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Function to check if frontend is running
check_frontend() {
    print "Checking if frontend is running..."
    
    if curl -s --connect-timeout $TIMEOUT $FRONTEND_URL > /dev/null 2>&1; then
        print_success "Frontend is running"
        return 0
    else
        print_error "Frontend is not running on $FRONTEND_URL"
        print "Please start the frontend first: ./dev.sh frontend"
        return 1
    fi
}

# Function to test frontend build
test_build() {
    print "Testing frontend build..."
    
    cd frontend
    
    # Check if build tools are available
    if command -v bun &> /dev/null; then
        BUILD_CMD="bun run build"
    elif command -v npm &> /dev/null; then
        BUILD_CMD="npm run build"
    else
        print_error "No build tool available (bun or npm)"
        return 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print "Installing dependencies..."
        if command -v bun &> /dev/null; then
            bun install
        else
            npm install
        fi
    fi
    
    # Run build
    print "Building frontend..."
    if $BUILD_CMD; then
        print_success "Frontend build successful"
        
        # Check if build artifacts exist
        if [ -d ".svelte-kit/output/client" ]; then
            print_success "Build artifacts created"
        else
            print_error "Build artifacts not found"
            return 1
        fi
    else
        print_error "Frontend build failed"
        return 1
    fi
    
    cd ..
}

# Function to test frontend linting
test_lint() {
    print "Testing frontend linting..."
    
    cd frontend
    
    # Check if linting is available
    if [ -f "package.json" ] && grep -q '"lint"' package.json; then
        if command -v bun &> /dev/null; then
            LINT_CMD="bun run lint"
        elif command -v npm &> /dev/null; then
            LINT_CMD="npm run lint"
        else
            print_warning "No linting tool available"
            return 0
        fi
        
        if $LINT_CMD; then
            print_success "Frontend linting passed"
        else
            print_error "Frontend linting failed"
            return 1
        fi
    else
        print_warning "No linting configured"
    fi
    
    cd ..
}

# Function to test frontend type checking
test_types() {
    print "Testing frontend type checking..."
    
    cd frontend
    
    # Check if TypeScript is available
    if [ -f "tsconfig.json" ]; then
        if command -v bun &> /dev/null; then
            TYPE_CMD="bun run check"
        elif command -v npm &> /dev/null; then
            TYPE_CMD="npm run check"
        else
            print_warning "No type checking tool available"
            return 0
        fi
        
        # Check if check script exists
        if grep -q '"check"' package.json; then
            if $TYPE_CMD; then
                print_success "Frontend type checking passed"
            else
                print_error "Frontend type checking failed"
                return 1
            fi
        else
            print_warning "No type checking script configured"
        fi
    else
        print_warning "No TypeScript configuration found"
    fi
    
    cd ..
}

# Function to test frontend accessibility
test_accessibility() {
    print "Testing frontend accessibility..."
    
    # Check if frontend is running
    if ! check_frontend; then
        return 1
    fi
    
    # Basic accessibility checks
    local response=$(curl -s $FRONTEND_URL)
    
    # Check for basic HTML structure
    if echo "$response" | grep -q "<!DOCTYPE html"; then
        print_success "Valid HTML document"
    else
        print_error "Invalid HTML document"
        return 1
    fi
    
    # Check for title tag
    if echo "$response" | grep -q "<title>"; then
        print_success "Page has title tag"
    else
        print_warning "Page missing title tag"
    fi
    
    # Check for meta viewport
    if echo "$response" | grep -q "viewport"; then
        print_success "Page has viewport meta tag"
    else
        print_warning "Page missing viewport meta tag"
    fi
    
    print_success "Basic accessibility checks passed"
}

# Function to test frontend performance
test_performance() {
    print "Testing frontend performance..."
    
    # Check if frontend is running
    if ! check_frontend; then
        return 1
    fi
    
    # Measure page load time
    local start_time=$(date +%s%N)
    curl -s $FRONTEND_URL > /dev/null
    local end_time=$(date +%s%N)
    local load_time=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
    
    if [ $load_time -lt 2000 ]; then
        print_success "Page load time: ${load_time}ms (Good)"
    elif [ $load_time -lt 5000 ]; then
        print_warning "Page load time: ${load_time}ms (Acceptable)"
    else
        print_error "Page load time: ${load_time}ms (Slow)"
        return 1
    fi
}

# Function to run all frontend tests
run_tests() {
    print "Starting frontend tests..."
    print "Frontend URL: $FRONTEND_URL"
    echo ""
    
    local failed_tests=0
    
    # Test 1: Build
    if ! test_build; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 2: Linting
    if ! test_lint; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 3: Type checking
    if ! test_types; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 4: Accessibility
    if ! test_accessibility; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 5: Performance
    if ! test_performance; then
        ((failed_tests++))
    fi
    echo ""
    
    # Summary
    print "Frontend Test Summary:"
    if [ $failed_tests -eq 0 ]; then
        print_success "All frontend tests passed! 🎉"
        return 0
    else
        print_error "$failed_tests test(s) failed"
        return 1
    fi
}

# Function to show help
show_help() {
    echo "Algorithm Visualizer - Frontend Test Script"
    echo ""
    echo "Usage: ./test-frontend.sh [command]"
    echo ""
    echo "Commands:"
    echo "  test          - Run all frontend tests (default)"
    echo "  build         - Test frontend build only"
    echo "  lint          - Test frontend linting only"
    echo "  types         - Test frontend type checking only"
    echo "  accessibility - Test frontend accessibility only"
    echo "  performance   - Test frontend performance only"
    echo "  help          - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./test-frontend.sh              # Run all tests"
    echo "  ./test-frontend.sh build        # Test build only"
    echo "  ./test-frontend.sh accessibility # Test accessibility only"
}

# Main script logic
case "${1:-test}" in
    "test")
        run_tests
        ;;
    "build")
        test_build
        ;;
    "lint")
        test_lint
        ;;
    "types")
        test_types
        ;;
    "accessibility")
        test_accessibility
        ;;
    "performance")
        test_performance
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
