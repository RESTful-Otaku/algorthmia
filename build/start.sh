#!/bin/bash

# Start the Algorithm Visualizer
echo "🚀 Starting Algorithm Visualizer..."

# Check if server binary exists
if [ ! -f "./backend/server" ]; then
    echo "❌ Server binary not found. Please run build.sh first."
    exit 1
fi

# Start the server
echo "📡 Starting backend server on port 8080..."
cd backend
./server &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully (PID: $SERVER_PID)"
    echo "🌐 Application is available at: http://localhost:8080"
    echo "📊 API documentation available at: http://localhost:8080/api/v1/health"
    echo ""
    echo "Press Ctrl+C to stop the server"
    
    # Wait for user to stop
    wait $SERVER_PID
else
    echo "❌ Failed to start server"
    exit 1
fi
