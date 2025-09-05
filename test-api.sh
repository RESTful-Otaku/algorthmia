#!/bin/bash

# Algorithm Visualizer - API Test Script
# Simple script to test all API endpoints

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_BASE="http://localhost:8080/api/v1"
TIMEOUT=5

# Function to print colored output
print() {
    echo -e "${BLUE}[TEST]${NC} $1"
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

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    print "Testing: $description"
    
    local cmd="curl -s -w '%{http_code}' -o /tmp/api_response.json"
    
    if [ "$method" = "POST" ]; then
        cmd="$cmd -X POST -H 'Content-Type: application/json'"
        if [ ! -z "$data" ]; then
            cmd="$cmd -d '$data'"
        fi
    fi
    
    cmd="$cmd '$API_BASE$endpoint'"
    
    local response=$(eval $cmd)
    local status_code="${response: -3}"
    local body=$(cat /tmp/api_response.json 2>/dev/null || echo "")
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$description - Status: $status_code"
        if [ ! -z "$body" ]; then
            echo "   Response: $(echo $body | jq -r '.message // .success // "OK"' 2>/dev/null || echo "Valid JSON")"
        fi
        return 0
    else
        print_error "$description - Expected: $expected_status, Got: $status_code"
        if [ ! -z "$body" ]; then
            echo "   Response: $body"
        fi
        return 1
    fi
}

# Function to check if server is running
check_server() {
    print "Checking if server is running..."
    
    if curl -s --connect-timeout $TIMEOUT $API_BASE/health > /dev/null 2>&1; then
        print_success "Server is running"
        return 0
    else
        print_error "Server is not running on $API_BASE"
        print "Please start the server first: ./dev.sh backend"
        return 1
    fi
}

# Function to test algorithm execution
test_algorithm_execution() {
    local algorithm_id=$1
    local algorithm_name=$2
    
    print "Testing $algorithm_name execution..."
    
    local data='{"array_size": 5, "speed": 5}'
    local response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$API_BASE/algorithms/$algorithm_id/execute")
    
    if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
        local steps=$(echo "$response" | jq '.data | length')
        print_success "$algorithm_name executed successfully - Generated $steps steps"
        
        # Check if steps have required fields
        local first_step=$(echo "$response" | jq '.data[0]')
        if echo "$first_step" | jq -e '.step_number, .action, .data' > /dev/null 2>&1; then
            print_success "$algorithm_name - Step structure is valid"
        else
            print_error "$algorithm_name - Invalid step structure"
            return 1
        fi
    else
        print_error "$algorithm_name execution failed"
        echo "   Response: $response"
        return 1
    fi
}

# Main test function
run_tests() {
    print "Starting API tests..."
    print "API Base URL: $API_BASE"
    echo ""
    
    local failed_tests=0
    
    # Test 1: Health check
    if ! test_endpoint "GET" "/health" "" "200" "Health check"; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 2: Get all algorithms
    if ! test_endpoint "GET" "/algorithms" "" "200" "Get all algorithms"; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 3: Get algorithms by type
    if ! test_endpoint "GET" "/algorithms/type/sorting" "" "200" "Get sorting algorithms"; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 4: Get specific algorithm
    if ! test_endpoint "GET" "/algorithms/bubble_sort" "" "200" "Get bubble sort algorithm"; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 5: Get algorithm config
    if ! test_endpoint "GET" "/algorithms/bubble_sort/config" "" "200" "Get bubble sort config"; then
        ((failed_tests++))
    fi
    echo ""
    
    # Test 6: Test algorithm executions
    print "Testing algorithm executions..."
    
    # Get list of algorithms
    local algorithms_response=$(curl -s "$API_BASE/algorithms")
    local algorithms=$(echo "$algorithms_response" | jq -r '.data[] | select(.enabled == true) | .id' 2>/dev/null)
    
    if [ -z "$algorithms" ]; then
        print_error "No algorithms found"
        ((failed_tests++))
    else
        while IFS= read -r algorithm_id; do
            if [ ! -z "$algorithm_id" ]; then
                local algorithm_name=$(echo "$algorithms_response" | jq -r ".data[] | select(.id == \"$algorithm_id\") | .name")
                if ! test_algorithm_execution "$algorithm_id" "$algorithm_name"; then
                    ((failed_tests++))
                fi
                echo ""
            fi
        done <<< "$algorithms"
    fi
    
    # Test 7: Test invalid endpoints
    print "Testing error handling..."
    
    if ! test_endpoint "GET" "/algorithms/nonexistent" "" "404" "Get non-existent algorithm"; then
        ((failed_tests++))
    fi
    
    if ! test_endpoint "GET" "/algorithms/type/invalid" "" "400" "Get algorithms with invalid type"; then
        ((failed_tests++))
    fi
    
    if ! test_endpoint "POST" "/algorithms/bubble_sort/execute" '{"array_size": 0}' "400" "Execute with invalid array size"; then
        ((failed_tests++))
    fi
    
    echo ""
    
    # Summary
    print "Test Summary:"
    if [ $failed_tests -eq 0 ]; then
        print_success "All tests passed! 🎉"
        return 0
    else
        print_error "$failed_tests test(s) failed"
        return 1
    fi
}

# Function to show help
show_help() {
    echo "Algorithm Visualizer - API Test Script"
    echo ""
    echo "Usage: ./test-api.sh [command]"
    echo ""
    echo "Commands:"
    echo "  test        - Run all API tests (default)"
    echo "  health      - Test health endpoint only"
    echo "  algorithms  - Test algorithms endpoints only"
    echo "  execute     - Test algorithm execution only"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./test-api.sh              # Run all tests"
    echo "  ./test-api.sh health       # Test health only"
    echo "  ./test-api.sh algorithms   # Test algorithms only"
}

# Main script logic
case "${1:-test}" in
    "test")
        if check_server; then
            run_tests
        else
            exit 1
        fi
        ;;
    "health")
        if check_server; then
            test_endpoint "GET" "/health" "" "200" "Health check"
        else
            exit 1
        fi
        ;;
    "algorithms")
        if check_server; then
            test_endpoint "GET" "/algorithms" "" "200" "Get all algorithms"
            test_endpoint "GET" "/algorithms/type/sorting" "" "200" "Get sorting algorithms"
            test_endpoint "GET" "/algorithms/bubble_sort" "" "200" "Get bubble sort algorithm"
        else
            exit 1
        fi
        ;;
    "execute")
        if check_server; then
            test_algorithm_execution "bubble_sort" "Bubble Sort"
        else
            exit 1
        fi
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
