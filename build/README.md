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
