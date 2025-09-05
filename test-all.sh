#!/bin/bash

# Algorithm Visualizer - Comprehensive Test Suite
# Balances front-end and back-end testing as recommended by industry best practices
# Based on insights from LinkedIn's testing strategies

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
BACKEND_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:5173"
TIMEOUT=10

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print colored output
print() {
    echo -e "${BLUE}[TEST-SUITE]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED_TESTS++))
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED_TESTS++))
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_section() {
    echo -e "${PURPLE}[SECTION]${NC} $1"
}

# Function to run a test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    local test_type="${3:-unit}"
    
    ((TOTAL_TESTS++))
    print "Running $test_type test: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_success "$test_name"
        return 0
    else
        print_error "$test_name"
        return 1
    fi
}

# Function to check if services are running
check_services() {
    print_section "Checking Service Availability"
    
    # Check backend
    if curl -s --connect-timeout $TIMEOUT $BACKEND_URL/api/v1/health > /dev/null 2>&1; then
        print_success "Backend service is running"
    else
        print_error "Backend service is not running"
        print_info "Start backend with: ./dev.sh backend"
        return 1
    fi
    
    # Check frontend
    if curl -s --connect-timeout $TIMEOUT $FRONTEND_URL > /dev/null 2>&1; then
        print_success "Frontend service is running"
    else
        print_error "Frontend service is not running"
        print_info "Start frontend with: ./dev.sh frontend"
        return 1
    fi
    
    echo ""
}

# Function to run backend unit tests
test_backend_units() {
    print_section "Backend Unit Tests"
    
    cd backend
    
    # Test algorithm implementations
    run_test "Bubble Sort Algorithm" "go test ./internal/algorithm/sorting/... -v" "unit"
    run_test "Algorithm Manager" "go test ./internal/algorithm/... -v" "unit"
    run_test "API Handlers" "go test ./internal/api/... -v" "unit"
    run_test "Configuration" "go test ./internal/config/... -v" "unit"
    run_test "Models" "go test ./internal/models/... -v" "unit"
    
    cd ..
    echo ""
}

# Function to run backend integration tests
test_backend_integration() {
    print_section "Backend Integration Tests"
    
    # Test API endpoints
    run_test "Health Check Endpoint" "curl -s $BACKEND_URL/api/v1/health | jq -e '.success'"
    run_test "Get Algorithms Endpoint" "curl -s $BACKEND_URL/api/v1/algorithms | jq -e '.success'"
    run_test "Get Algorithm by Type" "curl -s $BACKEND_URL/api/v1/algorithms/type/sorting | jq -e '.success'"
    run_test "Get Specific Algorithm" "curl -s $BACKEND_URL/api/v1/algorithms/bubble_sort | jq -e '.success'"
    run_test "Get Algorithm Config" "curl -s $BACKEND_URL/api/v1/algorithms/bubble_sort/config | jq -e '.success'"
    
    # Test algorithm execution
    run_test "Bubble Sort Execution" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": 5, \"speed\": 5}' $BACKEND_URL/api/v1/algorithms/bubble_sort/execute | jq -e '.success'"
    run_test "Selection Sort Execution" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": 5, \"speed\": 5}' $BACKEND_URL/api/v1/algorithms/selection_sort/execute | jq -e '.success'"
    run_test "Insertion Sort Execution" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": 5, \"speed\": 5}' $BACKEND_URL/api/v1/algorithms/insertion_sort/execute | jq -e '.success'"
    run_test "Merge Sort Execution" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": 5, \"speed\": 5}' $BACKEND_URL/api/v1/algorithms/merge_sort/execute | jq -e '.success'"
    run_test "Quick Sort Execution" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": 5, \"speed\": 5}' $BACKEND_URL/api/v1/algorithms/quick_sort/execute | jq -e '.success'"
    
    # Test error handling
    run_test "Invalid Algorithm ID" "curl -s $BACKEND_URL/api/v1/algorithms/invalid | jq -e '.success == false'"
    run_test "Invalid Array Size" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": 0}' $BACKEND_URL/api/v1/algorithms/bubble_sort/execute | jq -e '.success == false'"
    
    echo ""
}

# Function to run frontend unit tests
test_frontend_units() {
    print_section "Frontend Unit Tests"
    
    cd frontend
    
    # Test build
    run_test "Frontend Build" "bun run build" "unit"
    
    # Test linting if available
    if [ -f "package.json" ] && grep -q '"lint"' package.json; then
        run_test "Frontend Linting" "bun run lint" "unit"
    else
        print_warning "No linting configured"
    fi
    
    # Test type checking if available
    if [ -f "tsconfig.json" ] && grep -q '"check"' package.json; then
        run_test "TypeScript Type Checking" "bun run check" "unit"
    else
        print_warning "No type checking configured"
    fi
    
    cd ..
    echo ""
}

# Function to run frontend integration tests
test_frontend_integration() {
    print_section "Frontend Integration Tests"
    
    # Test page accessibility
    run_test "HTML Document Structure" "curl -s $FRONTEND_URL | grep -q '<!DOCTYPE html'"
    run_test "Page Title Present" "curl -s $FRONTEND_URL | grep -q '<title>'"
    run_test "Viewport Meta Tag" "curl -s $FRONTEND_URL | grep -q 'viewport'"
    run_test "CSS Loading" "curl -s $FRONTEND_URL | grep -q 'stylesheet'"
    run_test "JavaScript Loading" "curl -s $FRONTEND_URL | grep -q 'script'"
    
    # Test performance
    local start_time=$(date +%s%N)
    curl -s $FRONTEND_URL > /dev/null
    local end_time=$(date +%s%N)
    local load_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ $load_time -lt 3000 ]; then
        print_success "Page Load Performance (${load_time}ms)"
    else
        print_warning "Page Load Performance (${load_time}ms) - Consider optimization"
    fi
    
    echo ""
}

# Function to run end-to-end tests
test_end_to_end() {
    print_section "End-to-End Tests"
    
    # Test full workflow
    run_test "Complete Algorithm Workflow" "
        # Get algorithms
        algorithms=\$(curl -s $BACKEND_URL/api/v1/algorithms | jq -r '.data[0].id')
        if [ ! -z \"\$algorithms\" ]; then
            # Execute algorithm
            result=\$(curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": 3, \"speed\": 5}' $BACKEND_URL/api/v1/algorithms/\$algorithms/execute)
            echo \"\$result\" | jq -e '.success' > /dev/null
        else
            false
        fi
    " "e2e"
    
    # Test API integration from frontend perspective
    run_test "Frontend-Backend API Integration" "
        # Simulate frontend API call
        response=\$(curl -s $BACKEND_URL/api/v1/algorithms)
        echo \"\$response\" | jq -e '.success' > /dev/null && \
        echo \"\$response\" | jq -e '.data | length > 0' > /dev/null
    " "e2e"
    
    echo ""
}

# Function to run performance tests
test_performance() {
    print_section "Performance Tests"
    
    # Backend performance
    local start_time=$(date +%s%N)
    curl -s $BACKEND_URL/api/v1/algorithms > /dev/null
    local end_time=$(date +%s%N)
    local api_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ $api_time -lt 100 ]; then
        print_success "API Response Time (${api_time}ms)"
    else
        print_warning "API Response Time (${api_time}ms) - Consider optimization"
    fi
    
    # Algorithm execution performance
    local start_time=$(date +%s%N)
    curl -s -X POST -H 'Content-Type: application/json' -d '{"array_size": 20, "speed": 5}' $BACKEND_URL/api/v1/algorithms/bubble_sort/execute > /dev/null
    local end_time=$(date +%s%N)
    local exec_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ $exec_time -lt 1000 ]; then
        print_success "Algorithm Execution Time (${exec_time}ms)"
    else
        print_warning "Algorithm Execution Time (${exec_time}ms) - Consider optimization"
    fi
    
    echo ""
}

# Function to run security tests
test_security() {
    print_section "Security Tests"
    
    # Test CORS headers
    run_test "CORS Headers Present" "curl -s -I $BACKEND_URL/api/v1/health | grep -q 'Access-Control-Allow-Origin'"
    
    # Test input validation
    run_test "Input Validation - Negative Array Size" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": -1}' $BACKEND_URL/api/v1/algorithms/bubble_sort/execute | jq -e '.success == false'"
    run_test "Input Validation - Oversized Array" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"array_size\": 10000}' $BACKEND_URL/api/v1/algorithms/bubble_sort/execute | jq -e '.success == false'"
    
    # Test error handling
    run_test "Error Handling - Invalid JSON" "curl -s -X POST -H 'Content-Type: application/json' -d '{invalid json}' $BACKEND_URL/api/v1/algorithms/bubble_sort/execute | jq -e '.success == false'"
    
    echo ""
}

# Function to run all tests
run_all_tests() {
    print "Starting Comprehensive Test Suite"
    print "Following industry best practices for balanced front-end and back-end testing"
    echo ""
    
    # Check prerequisites
    if ! check_services; then
        print_error "Required services are not running. Please start them first."
        print_info "Use: ./dev.sh both"
        exit 1
    fi
    
    # Run test categories
    test_backend_units
    test_backend_integration
    test_frontend_units
    test_frontend_integration
    test_end_to_end
    test_performance
    test_security
    
    # Print summary
    print_section "Test Summary"
    print_info "Total Tests: $TOTAL_TESTS"
    print_success "Passed: $PASSED_TESTS"
    if [ $FAILED_TESTS -gt 0 ]; then
        print_error "Failed: $FAILED_TESTS"
    else
        print_success "Failed: $FAILED_TESTS"
    fi
    
    # Calculate success rate
    local success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    print_info "Success Rate: ${success_rate}%"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_success "All tests passed! 🎉"
        print_info "Your application is ready for production deployment."
        return 0
    else
        print_error "Some tests failed. Please review and fix issues."
        return 1
    fi
}

# Function to show help
show_help() {
    echo "Algorithm Visualizer - Comprehensive Test Suite"
    echo ""
    echo "This script implements balanced front-end and back-end testing strategies"
    echo "as recommended by industry best practices and LinkedIn testing experts."
    echo ""
    echo "Usage: ./test-all.sh [command]"
    echo ""
    echo "Commands:"
    echo "  all          - Run all tests (default)"
    echo "  backend      - Run backend tests only"
    echo "  frontend     - Run frontend tests only"
    echo "  integration  - Run integration tests only"
    echo "  e2e          - Run end-to-end tests only"
    echo "  performance  - Run performance tests only"
    echo "  security     - Run security tests only"
    echo "  help         - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./test-all.sh              # Run all tests"
    echo "  ./test-all.sh backend      # Test backend only"
    echo "  ./test-all.sh integration  # Test integration only"
    echo ""
    echo "Prerequisites:"
    echo "  - Backend running on port 8080"
    echo "  - Frontend running on port 5173"
    echo "  - Start services with: ./dev.sh both"
}

# Main script logic
case "${1:-all}" in
    "all")
        run_all_tests
        ;;
    "backend")
        check_services
        test_backend_units
        test_backend_integration
        ;;
    "frontend")
        check_services
        test_frontend_units
        test_frontend_integration
        ;;
    "integration")
        check_services
        test_backend_integration
        test_frontend_integration
        ;;
    "e2e")
        check_services
        test_end_to_end
        ;;
    "performance")
        check_services
        test_performance
        ;;
    "security")
        check_services
        test_security
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
