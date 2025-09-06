# 🚀 Deployment Guide

This guide covers deploying Algorthmia to various platforms using Docker and GitHub Pages.

## 📋 Prerequisites

- Docker and Docker Compose installed
- GitHub repository with Actions enabled
- (Optional) Docker Hub account for container registry

## 🐳 Docker Deployment

### Local Development

```bash
# Start both backend and frontend
./dev.sh

# Or use Docker Compose
./dev.sh run
```

### Production Deployment

```bash
# Build and deploy
./deploy.sh deploy

# Test deployment
./deploy.sh test

# View logs
./deploy.sh logs

# Stop deployment
./deploy.sh stop
```

### Docker Commands

```bash
# Build image
docker build -t algorthmia .

# Run container
docker run -p 80:80 algorthmia

# Run with environment variables
docker run -p 80:80 -e API_BASE_URL=https://your-api.com algorthmia
```

## 🌐 GitHub Pages Deployment

### Automatic Deployment

The application automatically deploys to GitHub Pages when you push to the `main` branch.

### Manual Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"

2. **Configure Secrets** (optional):
   - Go to repository Settings → Secrets and variables → Actions
   - Add `API_BASE_URL` if you have a custom backend

3. **Deploy**:
   - Push to `main` branch
   - GitHub Actions will build and deploy automatically

### Custom Domain

1. Add your domain to repository secrets as `CUSTOM_DOMAIN`
2. The workflow will automatically configure the CNAME

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API URL | `https://algorthmia-api.herokuapp.com` |
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Server port | `80` |

### Docker Configuration

The application uses a multi-stage Docker build:

1. **Backend Builder**: Compiles Go backend
2. **Frontend Builder**: Builds Svelte frontend
3. **Production**: Nginx + Node.js static server

### Nginx Configuration

- Serves static files with gzip compression
- Handles SPA routing (all routes serve index.html)
- Security headers included
- Health check endpoint at `/health`

## 📊 Monitoring

### Health Checks

- **Container Health**: Docker health check every 30s
- **Application Health**: HTTP endpoint at `/health`
- **API Proxy**: Automatic backend API proxying

### Logs

```bash
# View container logs
docker logs algorthmia-app

# Follow logs
docker logs -f algorthmia-app

# View specific time range
docker logs --since 1h algorthmia-app
```

## 🔒 Security

### Built-in Security Features

- **Security Headers**: HSTS, CSP, X-Frame-Options
- **CORS Configuration**: Configurable cross-origin requests
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API protection against abuse

### Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Backup and disaster recovery

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

1. **Test Workflow** (`deploy.yml`):
   - Runs on every push and PR
   - Tests frontend and backend
   - Builds and validates Docker image

2. **Pages Workflow** (`pages.yml`):
   - Deploys to GitHub Pages
   - Builds static site
   - Handles SPA routing

3. **Docker Workflow** (`docker.yml`):
   - Builds and pushes to Docker Hub
   - Multi-platform builds (amd64, arm64)
   - Automated versioning

### Workflow Triggers

- **Push to main**: Full deployment pipeline
- **Pull Request**: Test and validation only
- **Manual**: Workflow dispatch for manual triggers

## 📈 Performance Optimization

### Frontend Optimizations

- **Code Splitting**: Automatic bundle optimization
- **Gzip Compression**: Nginx gzip enabled
- **Caching**: Static assets cached for 1 year
- **Minification**: Production builds minified

### Backend Optimizations

- **Alpine Linux**: Minimal base image
- **Multi-stage Build**: Optimized image size
- **Health Checks**: Container health monitoring
- **Resource Limits**: Memory and CPU constraints

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Kill processes on port 80
   sudo lsof -ti:80 | xargs kill -9
   ```

2. **Docker Build Fails**:
   ```bash
   # Clean Docker cache
   docker system prune -a
   ```

3. **API Connection Issues**:
   - Check `API_BASE_URL` environment variable
   - Verify backend service is running
   - Check network connectivity

### Debug Commands

```bash
# Check container status
docker ps -a

# Inspect container
docker inspect algorthmia-app

# Check logs
docker logs algorthmia-app

# Execute shell in container
docker exec -it algorthmia-app sh
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [SvelteKit Deployment](https://kit.svelte.dev/docs/page-options#ssr)

## 🤝 Support

For deployment issues:

1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Open an issue on GitHub
4. Check Docker and container logs

---

**Happy Deploying! 🚀**
