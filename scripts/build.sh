#!/bin/bash

# Algorithm Visualizer Build Script
# This script builds both the backend and frontend for production

set -e

echo "🚀 Building Algorithm Visualizer..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Create build directory
print_status "Creating build directory..."
mkdir -p build/{backend,frontend}

# Build Backend
print_status "Building Go backend..."
cd backend

# Check if Go is installed
if ! command -v go &> /dev/null; then
    print_error "Go is not installed. Please install Go 1.21 or later."
    exit 1
fi

# Build the server
print_status "Compiling Go server..."
go build -ldflags="-s -w" -o ../build/backend/server cmd/server/main.go

if [ $? -eq 0 ]; then
    print_success "Backend built successfully"
else
    print_error "Backend build failed"
    exit 1
fi

# Copy configuration files
cp config.yaml ../build/backend/

cd ..

# Build Frontend
print_status "Building Svelte frontend..."
cd frontend

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    print_warning "Bun not found, trying npm..."
    if ! command -v npm &> /dev/null; then
        print_error "Neither bun nor npm is installed. Please install one of them."
        exit 1
    fi
    BUILD_CMD="npm run build"
else
    BUILD_CMD="bun run build"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    if command -v bun &> /dev/null; then
        bun install
    else
        npm install
    fi
fi

# Build the frontend
print_status "Building frontend with $BUILD_CMD..."
$BUILD_CMD

if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
    
    # Copy built files to build directory
    print_status "Copying frontend build files..."
    cp -r .svelte-kit/output/client/* ../build/frontend/
    
    # Create a simple index.html for the backend to serve
    cat > ../build/frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Algorithm Visualizer</title>
    <script type="module" crossorigin src="/_app/immutable/entry/start.js"></script>
    <link rel="stylesheet" crossorigin href="/_app/immutable/assets/_layout.css">
</head>
<body>
    <div id="app"></div>
</body>
</html>
EOF
    
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# Create production configuration
print_status "Creating production configuration..."
cat > build/config.yaml << EOF
server:
  host: "0.0.0.0"
  port: 8080
  read_timeout: 30
  write_timeout: 30

logging:
  level: "info"
  format: "json"

cors:
  allowed_origins:
    - "*"
  allowed_methods:
    - "GET"
    - "POST"
    - "PUT"
    - "DELETE"
    - "OPTIONS"
  allowed_headers:
    - "Origin"
    - "Content-Type"
    - "Accept"
    - "Authorization"

algorithms:
  max_array_size: 100
  default_array_size: 20
  min_array_size: 5
  max_speed: 10
  min_speed: 1
  default_speed: 5
EOF

# Create startup script
print_status "Creating startup script..."
cat > build/start.sh << 'EOF'
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
EOF

chmod +x build/start.sh

# Create Docker files
print_status "Creating Docker configuration..."

# Dockerfile for the entire application
cat > build/Dockerfile << 'EOF'
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app
COPY backend/ .
RUN go mod download
RUN go build -ldflags="-s -w" -o server cmd/server/main.go

FROM node:18-alpine AS frontend-builder

WORKDIR /app
COPY frontend/ .
RUN npm install
RUN npm run build

FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Copy backend
COPY --from=backend-builder /app/server .
COPY --from=backend-builder /app/config.yaml .

# Copy frontend
COPY --from=frontend-builder /app/.svelte-kit/output/client ./frontend

EXPOSE 8080

CMD ["./server"]
EOF

# Docker Compose file
cat > build/docker-compose.yml << 'EOF'
version: '3.8'

services:
  algorthmia:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SERVER_HOST=0.0.0.0
      - SERVER_PORT=8080
    volumes:
      - ./config.yaml:/root/config.yaml
EOF

# Create README for build
cat > build/README.md << 'EOF'
# Algorithm Visualizer - Production Build

This directory contains the production build of the Algorithm Visualizer.

## Quick Start

1. **Run directly:**
   ```bash
   ./start.sh
   ```

2. **Using Docker:**
   ```bash
   docker-compose up --build
   ```

3. **Manual start:**
   ```bash
   cd backend
   ./server
   ```

## Access

- **Application:** http://localhost:8080
- **API Health:** http://localhost:8080/api/v1/health
- **API Docs:** http://localhost:8080/api/v1/algorithms

## Features

- 5 Sorting Algorithms (Bubble, Selection, Insertion, Merge, Quick)
- Interactive Visualization
- Step-by-step Execution
- Light/Dark Theme
- Responsive Design
- Real-time Notifications

## Configuration

Edit `config.yaml` to modify server settings, CORS, or algorithm parameters.

## Troubleshooting

- Ensure port 8080 is available
- Check logs for any errors
- Verify all files are present in the build directory
EOF

print_success "Build completed successfully!"
print_status "Build artifacts created in: ./build/"
print_status ""
print_status "To start the application:"
print_status "  cd build && ./start.sh"
print_status ""
print_status "Or using Docker:"
print_status "  cd build && docker-compose up --build"
print_status ""
print_status "Application will be available at: http://localhost:8080"
