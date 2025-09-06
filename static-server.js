const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80;

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// API proxy configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://algorthmia-api.herokuapp.com';

// Proxy API requests to backend
app.use('/api', (req, res) => {
    const fetch = require('node-fetch');
    const url = `${API_BASE_URL}${req.originalUrl}`;
    
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
        res.status(500).json({ error: 'API request failed' });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Algorthmia static server running on port ${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🔗 API Base URL: ${API_BASE_URL}`);
});
