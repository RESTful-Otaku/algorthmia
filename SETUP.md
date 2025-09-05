# Setup Guide

This guide will help you get the project running locally.

## Prerequisites

- **Node.js** (v18 or higher)
- **Go** (v1.21 or higher)
- **Docker** (optional, for containerized deployment)

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd algorthmia
```

### 2. Backend Setup
```bash
cd backend
go mod download
go run cmd/server/main.go
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Environment Variables

### Backend
The backend uses default configuration. You can override settings by setting environment variables:
- `BACKEND_PORT` (default: 8080)
- `BACKEND_HOST` (default: localhost)

### Frontend
Create a `.env` file in the frontend directory:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
go test ./...

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
go build -o bin/server cmd/server/main.go

# Frontend
cd frontend
npm run build
```

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Project Structure

```
algorthmia/
├── backend/           # Go backend API
├── frontend/          # SvelteKit frontend
├── docs/             # Documentation
├── docker-compose.yml # Docker configuration
├── Dockerfile        # Docker image
└── README.md         # Project overview
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in the configuration files
2. **Node modules issues**: Delete `node_modules` and run `npm install` again
3. **Go module issues**: Run `go mod tidy` in the backend directory

### Getting Help

- Check the logs in the terminal for error messages
- Ensure all prerequisites are installed
- Verify that ports 8080 and 5173 are available
