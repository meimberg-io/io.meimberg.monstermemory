# Unified Docker Compose Deployment Guide

This guide explains how to use **one docker-compose.yml** for both local development and production deployment.

## 🎯 **The Unified Approach**

### **One File, Two Environments**
- **Local Development**: Uses `.env` file with development settings
- **Production Deployment**: Uses `.env` file created by GitHub Actions pipeline
- **Same docker-compose.yml**: Works in both environments

## 📁 **File Structure**

```
your-app/
├── docker-compose.yml          # Single compose file for both environments
├── env.example                 # Template for local development
├── .env                        # Local development variables (gitignored)
├── .github/workflows/
│   └── deploy-[app-name].yml   # Deployment pipeline
└── Dockerfile
```

## 🔧 **Docker Compose Configuration**

### **Example docker-compose.yml**
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${APP_NAME:-monstermemory}
    ports:
      - "${APP_PORT:-8201}:5679"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=5679
      # Database connection
      - DB_HOST=${DB_HOST:-mysql}
      - DB_PORT=${DB_PORT:-3306}
      - DB_NAME=${DB_NAME:-appdb}
      - DB_USER=${DB_USER:-appuser}
      - DB_PASSWORD=${DB_PASSWORD:-devpassword}
      # Redis connection
      - REDIS_HOST=${REDIS_HOST:-redis}
      - REDIS_PORT=${REDIS_PORT:-6379}
    volumes:
      - .:/app                    # Development volume
      - /app/node_modules         # Prevent overwriting node_modules
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5679/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: ${APP_NAME:-monstermemory}-mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-rootpassword}
      - MYSQL_DATABASE=${DB_NAME:-appdb}
      - MYSQL_USER=${DB_USER:-appuser}
      - MYSQL_PASSWORD=${DB_PASSWORD:-devpassword}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql-init:/docker-entrypoint-initdb.d
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 30s
      timeout: 10s
      retries: 5
    profiles:
      - database  # Only start when explicitly requested

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: ${APP_NAME:-monstermemory}-redis
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    profiles:
      - cache  # Only start when explicitly requested

volumes:
  mysql_data:

networks:
  app-network:
    driver: bridge
```

## 🚀 **Local Development Setup**

### **1. Copy Environment Template**
```bash
cp env.example .env
```

### **2. Customize .env for Development**
```bash
# .env
NODE_ENV=development
APP_PORT=8201
APP_NAME=monstermemory

# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=monstermemory_dev
DB_USER=monstermemory_user
DB_PASSWORD=devpassword
MYSQL_ROOT_PASSWORD=rootpassword

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Development specific
DEBUG=true
LOG_LEVEL=debug
```

### **3. Start Development Environment**

**Simple app (no database/Redis)**:
```bash
docker-compose up --build
```

**App with database**:
```bash
docker-compose --profile database up --build
```

**App with database and Redis**:
```bash
docker-compose --profile database --profile cache up --build
```

**App with all services**:
```bash
docker-compose up --build
```

## 🎯 **Production Deployment Setup**

### **1. Use Unified Deployment Template**
```bash
curl -o .github/workflows/deploy-monstermemory.yml https://raw.githubusercontent.com/your-username/serversetup/main/scripts/simple-unified-deployment-template.yml
```

### **2. Customize Deployment Template**
Replace placeholders:
- `[APP_NAME]` → `monstermemory`
- `[APP_PORT]` → Remove (uses GitHub variable)

### **3. Configure GitHub Variables**
```
HOST=your-server-ip
USERNAME=deploy
APP_PORT=8201
DB_NAME=monstermemory_prod
DB_USER=monstermemory_user
DB_PASSWORD=secure-production-password
MYSQL_ROOT_PASSWORD=secure-root-password
```

### **4. Configure GitHub Secrets** (if needed)
```
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key
```

## 🔄 **How It Works**

### **Local Development**
1. **docker-compose.yml** reads from `.env` file
2. **Development volumes** mounted for live reloading
3. **Profiles** allow selective service startup
4. **Default values** provide sensible defaults

### **Production Deployment**
1. **GitHub Actions** creates `.env` file with production values
2. **Same docker-compose.yml** downloaded to server
3. **Production image** used instead of building locally
4. **No development volumes** (production optimized)

## 🎨 **Environment Variable Strategy**

### **Local Development (.env)**
```bash
# Application
NODE_ENV=development
APP_PORT=8201
APP_NAME=monstermemory

# Database
DB_NAME=monstermemory_dev
DB_USER=monstermemory_user
DB_PASSWORD=devpassword

# Development
DEBUG=true
LOG_LEVEL=debug
```

### **Production (.env created by pipeline)**
```bash
# Application
NODE_ENV=production
APP_PORT=8201
APP_NAME=monstermemory

# Database
DB_NAME=monstermemory_prod
DB_USER=monstermemory_user
DB_PASSWORD=secure-production-password

# Production
DEBUG=false
LOG_LEVEL=info
```

## 🔧 **Advanced Features**

### **Service Profiles**
```yaml
services:
  mysql:
    profiles:
      - database  # Only start with --profile database
      
  redis:
    profiles:
      - cache     # Only start with --profile cache
```

**Usage**:
```bash
# Start only app
docker-compose up

# Start app + database
docker-compose --profile database up

# Start app + database + redis
docker-compose --profile database --profile cache up
```

### **Environment-Specific Overrides**
```yaml
# docker-compose.override.yml (local development)
services:
  app:
    volumes:
      - .:/app  # Live reloading
      - /app/node_modules
```

### **Conditional Services**
```yaml
services:
  app:
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
```

## 📊 **Benefits of Unified Approach**

### ✅ **Single Source of Truth**
- One docker-compose.yml for both environments
- No duplication of service definitions
- Consistent service configuration

### ✅ **Environment Flexibility**
- Easy switching between environments
- Environment-specific variables via .env
- Profiles for optional services

### ✅ **Development Experience**
- Same commands work locally and in production
- Easy to test production-like setup locally
- Consistent service behavior

### ✅ **Production Ready**
- No code changes needed for deployment
- Environment variables injected by pipeline
- Production-optimized configuration

## 🚨 **Best Practices**

### **Environment Variables**
1. **Use defaults** in docker-compose.yml for development
2. **Override in .env** for specific needs
3. **Keep secrets** in GitHub secrets, not variables
4. **Document** all required variables in env.example

### **Service Configuration**
1. **Use profiles** for optional services
2. **Health checks** for service dependencies
3. **Proper networking** for service communication
4. **Volume management** for persistent data

### **Development Workflow**
1. **Copy env.example** to .env for new developers
2. **Use profiles** to start only needed services
3. **Test production setup** locally before deploying
4. **Keep .env in .gitignore**

## 🎯 **Migration from Current Setup**

### **Step 1: Update docker-compose.yml**
- Add environment variable placeholders
- Add profiles for optional services
- Add health checks and dependencies

### **Step 2: Create env.example**
- Document all environment variables
- Provide development defaults
- Include comments for clarity

### **Step 3: Update Deployment Pipeline**
- Use unified deployment template
- Create .env file from GitHub variables/secrets
- Download docker-compose.yml from repository

### **Step 4: Test Both Environments**
- Test local development setup
- Test production deployment
- Verify all services work correctly

---

**This unified approach gives you the best of both worlds: simple local development and robust production deployment!** 🚀

