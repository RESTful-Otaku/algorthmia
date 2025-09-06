# 🚀 Fly.io Deployment Guide

This guide covers deploying Algorthmia to Fly.io, a global edge platform for containerized applications.

## 📋 Prerequisites

- [Fly.io account](https://fly.io/app/sign-up)
- [flyctl CLI installed](https://fly.io/docs/hands-on/install-flyctl/)
- Docker installed and running
- GitHub repository with Actions enabled

## 🔧 Initial Setup

### 1. Install flyctl

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
iwr https://fly.io/install.ps1 -useb | iex
```

### 2. Login to Fly.io

```bash
flyctl auth login
```

### 3. Initialize the App

```bash
# Run the initialization
./deploy-fly.sh init

# Or manually
flyctl launch --no-deploy --name algorthmia
```

## 🚀 Deployment

### Quick Deploy

```bash
# Build, test, and deploy
./deploy-fly.sh deploy
```

### Step-by-Step Deployment

```bash
# 1. Build and test locally
./deploy-fly.sh build

# 2. Deploy to Fly.io
./deploy-fly.sh deploy

# 3. Check status
./deploy-fly.sh status

# 4. Open in browser
./deploy-fly.sh open
```

## ⚙️ Configuration

### Environment Variables

Set environment variables for your app:

```bash
# Set API base URL
flyctl secrets set API_BASE_URL="https://your-api.com"

# Set Node environment
flyctl secrets set NODE_ENV="production"

# Interactive setup
./deploy-fly.sh set-env
```

### Scaling

```bash
# Scale to 3 instances
./deploy-fly.sh scale 3

# Or manually
flyctl scale count 3
```

### Regions

Deploy to specific regions:

```bash
# List available regions
flyctl platform regions

# Deploy to specific region
flyctl deploy --region sjc  # San Jose, CA
flyctl deploy --region lhr  # London, UK
flyctl deploy --region nrt  # Tokyo, Japan
```

## 📊 Monitoring

### App Status

```bash
# Check app status
flyctl status

# View logs
flyctl logs

# Follow logs in real-time
flyctl logs --follow
```

### Health Checks

The app includes automatic health checks:

- **Endpoint**: `/health`
- **Interval**: 30 seconds
- **Timeout**: 3 seconds
- **Grace Period**: 5 seconds

### Metrics

View app metrics in the Fly.io dashboard:

```bash
# Open dashboard
flyctl dashboard
```

## 🔒 Security

### SSL/TLS

Fly.io automatically provides SSL certificates for your domain.

### Secrets Management

Store sensitive data as secrets:

```bash
# Set secrets
flyctl secrets set DATABASE_URL="postgres://..."

# List secrets
flyctl secrets list

# Remove secret
flyctl secrets unset SECRET_NAME
```

### Network Security

Configure network access:

```bash
# Allow internal traffic only
flyctl proxy 8080:80 --internal

# Allow external traffic
flyctl proxy 8080:80
```

## 🌍 Global Deployment

### Multi-Region Deployment

Deploy to multiple regions for global performance:

```bash
# Deploy to multiple regions
flyctl deploy --region sjc
flyctl deploy --region lhr
flyctl deploy --region nrt
```

### Edge Computing

Fly.io provides edge computing capabilities:

- **Global CDN**: Static assets served from edge locations
- **Edge Functions**: Run code closer to users
- **Auto-scaling**: Scale based on demand

## 📈 Performance Optimization

### Resource Allocation

Configure CPU and memory:

```toml
# In fly.toml
[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

### Caching

Enable caching for better performance:

```bash
# Set cache headers
flyctl secrets set CACHE_TTL="3600"
```

### Database Connections

Optimize database connections:

```bash
# Set connection pool size
flyctl secrets set DB_POOL_SIZE="10"
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check build logs
   flyctl logs --build
   ```

2. **Deployment Failures**:
   ```bash
   # Check deployment status
   flyctl status
   flyctl logs
   ```

3. **Health Check Failures**:
   ```bash
   # Test health endpoint
   curl https://your-app.fly.dev/health
   ```

### Debug Commands

```bash
# SSH into running container
flyctl ssh console

# Check app configuration
flyctl config show

# View app info
flyctl info
```

### Log Analysis

```bash
# Filter logs by level
flyctl logs --level error

# Filter logs by time
flyctl logs --since 1h

# Export logs
flyctl logs > app-logs.txt
```

## 🔄 CI/CD Integration

### GitHub Actions

The repository includes a GitHub Actions workflow for automatic deployment:

1. **Set up secrets** in GitHub repository:
   - `FLY_API_TOKEN`: Your Fly.io API token
   - `API_BASE_URL`: Backend API URL (optional)

2. **Push to main branch** to trigger deployment

3. **Monitor deployment** in GitHub Actions tab

### Manual Deployment

```bash
# Deploy from CI/CD
flyctl deploy --dockerfile Dockerfile.fly --remote-only
```

## 💰 Cost Management

### Pricing

Fly.io pricing is based on:
- **Compute**: CPU and memory usage
- **Bandwidth**: Data transfer
- **Storage**: Persistent volumes

### Cost Optimization

```bash
# Scale down when not needed
flyctl scale count 0

# Use shared CPU for development
flyctl scale vm shared-cpu-1x

# Monitor usage
flyctl dashboard
```

## 📚 Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [flyctl Reference](https://fly.io/docs/flyctl/)
- [Docker on Fly.io](https://fly.io/docs/getting-started/dockerfile/)
- [Fly.io Community](https://community.fly.io/)

## 🤝 Support

For deployment issues:

1. Check the troubleshooting section
2. Review Fly.io documentation
3. Check app logs: `flyctl logs`
4. Open an issue on GitHub
5. Join the Fly.io community

---

**Happy Flying! 🚀**
