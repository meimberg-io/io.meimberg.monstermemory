#!/bin/bash

# One-time server setup script
# Run this ONCE on your Ubuntu server to prepare it for all app deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run this script as root or with sudo"
fi

log "🚀 Starting server setup for automated deployments..."

# Update system
log "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
log "🔧 Installing essential packages..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
log "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
else
    info "Docker is already installed"
fi

# Install Docker Compose
log "🐙 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    info "Docker Compose is already installed"
fi

# Create deploy user
log "👤 Setting up deploy user..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    usermod -aG sudo deploy
    
    # Create SSH directory for deploy user
    mkdir -p /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    chown deploy:deploy /home/deploy/.ssh
    
    info "Deploy user created. You'll need to add your SSH key to /home/deploy/.ssh/authorized_keys"
else
    info "Deploy user already exists"
fi

# Create application directories structure
log "📁 Creating application directories..."
mkdir -p /opt
mkdir -p /var/log/apps
mkdir -p /opt/backups
chmod 755 /opt
chmod 755 /var/log/apps
chmod 755 /opt/backups

# Setup log rotation
log "📋 Setting up log rotation..."
cat > /etc/logrotate.d/apps << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}

/var/log/apps/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF

# Configure firewall
log "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp   # SSH
    ufw allow 80/tcp   # HTTP
    ufw allow 443/tcp  # HTTPS
    ufw allow 8000:8999/tcp  # App port range
    info "Firewall configured - SSH, HTTP, HTTPS, and ports 8000-8999 allowed"
else
    warning "UFW not available - please configure firewall manually"
fi

# Install monitoring tools (optional)
log "📊 Installing monitoring tools..."
apt install -y htop iotop nethogs

# Setup Docker cleanup cron job
log "🧹 Setting up Docker cleanup..."
cat > /etc/cron.daily/docker-cleanup << 'EOF'
#!/bin/bash
# Clean up unused Docker resources
docker system prune -f
docker volume prune -f
EOF
chmod +x /etc/cron.daily/docker-cleanup



# Final instructions
log "🎉 Server setup completed!"
echo ""
info "📋 Next steps:"
echo "1. Add your SSH public key to /home/deploy/.ssh/authorized_keys"
echo "2. Test SSH access: ssh deploy@your-server-ip"
echo "3. Configure GitHub secrets (HOST, USERNAME, SSH_KEY)"
echo "4. Start deploying apps with GitHub Actions!"
echo ""
info "🔧 Available commands:"
echo "- docker system prune -f           # Clean up Docker"
echo "- systemctl status docker          # Check Docker status"
echo ""
info "📁 Directory structure:"
echo "- /opt/<app-name>/                 # App deployments"
echo "- /var/log/apps/                   # Application logs"
echo "- /opt/backups/                    # Backup storage"
echo ""
warning "⚠️  Remember to:"
echo "- Configure your domain DNS"
echo "- Set up SSL certificates (Let's Encrypt)"
echo "- Monitor disk space"
echo "- Regular security updates"

log "✅ Server is ready for automated deployments!"
