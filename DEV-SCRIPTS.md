# 🚀 Development Scripts

Simple, minimal scripts for iterative development and testing of the Algorithm Visualizer.

## 📋 Available Scripts

### 🔧 Development Script (`dev.sh`)

**Main development script for running services**

```bash
# Start both backend and frontend
./dev.sh

# Start only backend
./dev.sh backend

# Start only frontend  
./dev.sh frontend

# Run all tests
./dev.sh test

# Build for production
./dev.sh build

# Clean build artifacts
./dev.sh clean

# Stop all services
./dev.sh stop

# Show help
./dev.sh help
```

### 🧪 API Testing Script (`test-api.sh`)

**Comprehensive API endpoint testing**

```bash
# Test all API endpoints
./test-api.sh

# Test health endpoint only
./test-api.sh health

# Test algorithms endpoints only
./test-api.sh algorithms

# Test algorithm execution only
./test-api.sh execute
```

### 🎨 Frontend Testing Script (`test-frontend.sh`)

**Frontend-specific testing and validation**

```bash
# Test all frontend functionality
./test-frontend.sh

# Test build only
./test-frontend.sh build

# Test linting only
./test-frontend.sh lint

# Test type checking only
./test-frontend.sh types

# Test accessibility only
./test-frontend.sh accessibility

# Test performance only
./test-frontend.sh performance
```

### 🎯 Comprehensive Test Suite (`test-all.sh`)

**Balanced front-end and back-end testing following industry best practices**

Based on insights from [LinkedIn's testing strategies](https://www.linkedin.com/advice/0/how-do-you-balance-front-end-back-end-testing), this script implements:

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing  
- **End-to-End Tests**: Complete workflow testing
- **Performance Tests**: Speed and efficiency validation
- **Security Tests**: Input validation and error handling

```bash
# Run all tests (recommended)
./test-all.sh

# Run backend tests only
./test-all.sh backend

# Run frontend tests only
./test-all.sh frontend

# Run integration tests only
./test-all.sh integration

# Run end-to-end tests only
./test-all.sh e2e

# Run performance tests only
./test-all.sh performance

# Run security tests only
./test-all.sh security
```

## 🚀 Quick Start

### 1. **Start Development Environment**
```bash
# Start both services
./dev.sh

# Or start individually
./dev.sh backend    # Terminal 1
./dev.sh frontend   # Terminal 2
```

### 2. **Run Tests**
```bash
# Quick API test
./test-api.sh

# Comprehensive testing
./test-all.sh
```

### 3. **Build for Production**
```bash
# Build everything
./dev.sh build

# Or use the production build script
./scripts/build.sh
```

## 🔄 Iterative Development Workflow

### **Daily Development Cycle**
```bash
# 1. Start services
./dev.sh

# 2. Make changes to code
# ... edit files ...

# 3. Test changes
./test-api.sh health
./test-frontend.sh build

# 4. Run comprehensive tests
./test-all.sh

# 5. Stop services when done
./dev.sh stop
```

### **Feature Development Cycle**
```bash
# 1. Start development environment
./dev.sh

# 2. Develop feature
# ... code changes ...

# 3. Test specific areas
./test-api.sh algorithms
./test-frontend.sh accessibility

# 4. Full test suite
./test-all.sh

# 5. Build and deploy
./dev.sh build
```

## 📊 Test Coverage

The comprehensive test suite covers:

### **Backend Testing**
- ✅ Unit tests for all algorithms
- ✅ API endpoint validation
- ✅ Error handling and edge cases
- ✅ Performance benchmarks
- ✅ Security validation

### **Frontend Testing**
- ✅ Build process validation
- ✅ TypeScript type checking
- ✅ Accessibility compliance
- ✅ Performance metrics
- ✅ Cross-browser compatibility

### **Integration Testing**
- ✅ API communication
- ✅ Data flow validation
- ✅ Error propagation
- ✅ End-to-end workflows

## 🛠️ Prerequisites

- **Go 1.21+** for backend development
- **Node.js 18+** or **Bun** for frontend development
- **curl** and **jq** for API testing
- **Modern terminal** with color support

## 🎯 Best Practices

### **Following Industry Standards**
Based on [LinkedIn's testing advice](https://www.linkedin.com/advice/0/how-do-you-balance-front-end-back-end-testing):

1. **Balanced Testing**: Equal focus on frontend and backend
2. **Common Language**: JavaScript/TypeScript for consistency
3. **Unified Tools**: Single test runner for both layers
4. **Shared Data**: Consistent test data across layers
5. **Standardized APIs**: RESTful endpoints for integration

### **Development Tips**
- Run `./test-all.sh` before committing code
- Use `./dev.sh test` for quick validation
- Check `./test-api.sh` for API changes
- Validate frontend with `./test-frontend.sh`
- Monitor performance with `./test-all.sh performance`

## 🚨 Troubleshooting

### **Common Issues**

**Services won't start:**
```bash
# Check if ports are in use
./dev.sh stop
./dev.sh
```

**Tests failing:**
```bash
# Check service status
./test-all.sh backend
./test-all.sh frontend
```

**Build issues:**
```bash
# Clean and rebuild
./dev.sh clean
./dev.sh build
```

### **Port Conflicts**
- Backend: Port 8080
- Frontend: Port 5173
- Scripts automatically handle port conflicts

## 📈 Performance Monitoring

The test suite includes performance benchmarks:

- **API Response Time**: < 100ms target
- **Page Load Time**: < 3s target  
- **Algorithm Execution**: < 1s for 20 elements
- **Build Time**: < 30s target

## 🔒 Security Validation

Security tests cover:

- Input validation and sanitization
- CORS header configuration
- Error message security
- SQL injection prevention
- XSS protection

---

**Happy Coding! 🎉**

These scripts follow modern development practices and industry best practices for balanced front-end and back-end testing, ensuring your Algorithm Visualizer is production-ready and maintainable.
