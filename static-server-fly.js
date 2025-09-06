const express = require('express');
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 80;

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API proxy configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://algorthmia-api.herokuapp.com';

// Start backend server if not provided
let backendProcess = null;
if (!process.env.API_BASE_URL) {
    console.log('🚀 Starting backend server...');
    backendProcess = spawn('./backend', [], {
        stdio: 'inherit',
        env: { ...process.env, PORT: '8081' }
    });
    
    backendProcess.on('error', (err) => {
        console.error('Backend process error:', err);
    });
    
    backendProcess.on('exit', (code) => {
        console.log(`Backend process exited with code ${code}`);
    });
}

// Proxy API requests to backend
app.use('/api', (req, res) => {
    const fetch = require('node-fetch');
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8081';
    const url = `${backendUrl}${req.originalUrl}`;
    
    fetch(url, {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            ...req.headers
        },
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
        console.error('API Proxy Error:', error);
        res.status(500).json({ 
            error: 'API request failed',
            message: error.message,
            url: url
        });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        region: process.env.FLY_REGION || 'unknown'
    });
});

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    if (backendProcess) {
        backendProcess.kill('SIGTERM');
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    if (backendProcess) {
        backendProcess.kill('SIGINT');
    }
    process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Algorthmia running on port ${PORT}`);
    console.log(`📁 Serving files from: ${path.join(__dirname, 'public')}`);
    console.log(`🔗 API Base URL: ${process.env.API_BASE_URL || 'http://localhost:8081'}`);
    console.log(`🌍 Region: ${process.env.FLY_REGION || 'unknown'}`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'production'}`);
});
