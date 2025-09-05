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
