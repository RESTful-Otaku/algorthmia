# Multi-stage Docker build for Algorthmia
# Stage 1: Build Go backend
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Copy go mod files
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# Copy backend source
COPY backend/ ./

# Build the backend binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# Stage 2: Build Svelte frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 3: Create static server for GitHub Pages
FROM nginx:alpine AS production

# Install Node.js for serving SPA
RUN apk add --no-cache nodejs npm

# Copy built frontend
COPY --from=frontend-builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static server script
COPY static-server.js /usr/share/nginx/html/

# Create a simple package.json for the static server
RUN echo '{"name":"algorthmia-static","version":"1.0.0","dependencies":{"express":"^4.18.2","cors":"^2.8.5"}}' > /usr/share/nginx/html/package.json

# Install dependencies for static server
WORKDIR /usr/share/nginx/html
RUN npm install

# Expose port
EXPOSE 80

# Start the static server
CMD ["node", "static-server.js"]