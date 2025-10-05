# Monstermemory Deployment Guide

This guide explains how to deploy the Monstermemory application using the global deployment infrastructure.

> **Note**: This app uses the global deployment infrastructure. For setting up new servers or deploying other apps, see the [Global Deployment Guide](https://github.com/your-username/newrepo).

## Prerequisites

- Ubuntu server (18.04 or later)
- Docker and Docker Compose installed
- SSH access to the server
- GitHub repository with GitHub Actions enabled

## Setup Instructions

### 1. One-Time Server Setup

**Run this ONCE on your Ubuntu server to prepare it for all app deployments:**

```bash
# Download and run the global server setup script
curl -fsSL https://raw.githubusercontent.com/your-username/newrepo/main/scripts/server-setup.sh | sudo bash
```

This script will:
- ✅ Install Docker & Docker Compose
- ✅ Create a `deploy` user with proper permissions
- ✅ Set up application directories (`/opt/<app-name>/`)
- ✅ Configure firewall (ports 8000-8999 for apps)
- ✅ Set up log rotation and cleanup
- ✅ Install monitoring tools

> **For detailed server setup instructions**, see the [Global Deployment Guide](https://github.com/your-username/newrepo/blob/main/docs/GLOBAL-DEPLOYMENT-GUIDE.md).

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:

```
SSH_KEY=your-private-ssh-key
```

**GitHub Variables** (required):
```
HOST=your-server-ip-or-domain
USERNAME=deploy  # Use the deploy user created by server-setup.sh
APP_PORT=8201  # Port for this specific app
```

**Important**: Use the `deploy` user created by the server setup script!


### 3. GitHub Actions Workflow

The workflow is configured in `.github/workflows/deploy-monstermemory.yml`. It will:

1. **Test**: Run linting, build tests, and frontend tests
2. **Build**: Build and push Docker image to GHCR
3. **Deploy**: Deploy to your Ubuntu server

> **For deploying other apps**, copy the template from [Global Deployment Infrastructure](https://github.com/your-username/newrepo).

### 4. Deployment Process

#### Automatic Deployment:
- Push to `main` or `master` branch
- GitHub Actions will automatically build and deploy
- **No manual intervention required!**

#### For Future Apps:
1. Copy the template from [Global Deployment Infrastructure](https://github.com/your-username/newrepo/scripts/app-deployment-template.yml)
2. Replace placeholders: `[APP_NAME]`, `[APP_PORT]`, `[APP_DIRECTORY]`
3. Push to trigger automatic deployment

> **See the [Global Deployment Guide](https://github.com/your-username/newrepo/blob/main/docs/GLOBAL-DEPLOYMENT-GUIDE.md) for detailed instructions.**

#### Manual Deployment (if needed):
```bash
# On the server - create docker-compose manually
mkdir -p /opt/monstermemory && cd /opt/monstermemory
# Create docker-compose.prod.yml with your app configuration
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Application Management

Use Docker commands directly for application management:

```bash
# Check application status
docker ps

# View logs
docker logs monstermemory

# Stop application
docker-compose -f /opt/monstermemory/docker-compose.prod.yml down

# Start application
docker-compose -f /opt/monstermemory/docker-compose.prod.yml up -d

# Restart application
docker-compose -f /opt/monstermemory/docker-compose.prod.yml restart
```

### 6. SSL Setup (Optional)

For production with SSL:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# Setup SSL certificate (manual process)
sudo certbot --nginx -d your-domain.com
```

### 7. Monitoring and Maintenance

#### Health Checks:
- The application includes health checks
- Access: `http://your-server-ip:8201/`

#### Log Rotation:
- Log rotation is automatically configured
- Logs are kept for 7 days

#### Updates:
- Automatic updates on git push to main branch
- Manual updates: `sudo ./scripts/deploy.sh deploy`

## Troubleshooting

### Common Issues:

1. **SSH Connection Failed**:
   - Verify SSH key is correct
   - Check server IP/domain
   - Ensure SSH access is enabled

2. **Docker Image Not Found**:
   - Check GHCR permissions
   - Verify GitHub token has package write permissions

3. **Application Not Starting**:
   - Check logs: `docker logs monstermemory`
   - Verify port 8201 is not in use
   - Check Docker daemon status

4. **Health Check Failing**:
   - Verify application is accessible internally
   - Check firewall settings
   - Review application logs

### Debug Commands:

```bash
# Check Docker status
docker ps -a
docker logs monstermemory

# Check network connectivity
curl -I http://localhost:8201/
```

## Security Considerations

1. **Firewall**: Configure UFW to allow only necessary ports (80, 443, 22)
2. **SSH Keys**: Use SSH keys instead of passwords
3. **Updates**: Keep the server and Docker updated
4. **SSL**: Use HTTPS in production
5. **Monitoring**: Set up monitoring and alerting

## Environment Variables

The application supports the following environment variables:

- `NODE_ENV`: Set to `production` for production deployments
- `PORT`: Application port (default: 5679)

## Support

For issues or questions:
1. Check the logs first
2. Review the GitHub Actions workflow
3. Verify server configuration
4. Check Docker and Docker Compose versions

## Access Your Application

Once deployed, your Monstermemory game will be available at:
- **HTTP**: `http://your-server-ip:8201/`
- **HTTPS**: `https://your-domain.com:8201/` (if SSL is configured)
