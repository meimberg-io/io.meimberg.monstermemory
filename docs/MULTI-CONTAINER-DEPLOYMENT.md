# Multi-Container Deployment Guide

This guide explains how to deploy applications that need additional services like databases, Redis, etc.

## 🎯 **Approaches for Multi-Container Apps**

### **Approach 1: Custom Docker Compose File (Recommended)**

**Best for**: Apps with complex service dependencies

#### **How it works**:
1. Create a `docker-compose.prod.yml` in your app repository
2. Use the flexible deployment template
3. Deployment automatically uses your custom compose file

#### **Steps**:

1. **Copy the flexible template**:
   ```bash
   curl -o .github/workflows/deploy-[APP_NAME].yml https://raw.githubusercontent.com/your-username/serversetup/main/scripts/deploy-with-custom-compose-template.yml
   ```

2. **Create custom docker-compose.prod.yml** in your app repo:
   ```yaml
   services:
     $APP_NAME:
       image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
       container_name: $APP_NAME
       ports:
         - "$APP_PORT:8080"
       environment:
         - DB_HOST=mysql
         - REDIS_HOST=redis
       depends_on:
         mysql:
           condition: service_healthy
         redis:
           condition: service_healthy
       networks:
         - $APP_NAME-network

     mysql:
       image: mysql:8.0
       container_name: ${APP_NAME}-mysql
       environment:
         - MYSQL_DATABASE=appdb
         - MYSQL_USER=appuser
         - MYSQL_PASSWORD=apppassword
       volumes:
         - mysql_data:/var/lib/mysql
       networks:
         - $APP_NAME-network

     redis:
       image: redis:7-alpine
       container_name: ${APP_NAME}-redis
       networks:
         - $APP_NAME-network

   volumes:
     mysql_data:

   networks:
     $APP_NAME-network:
       driver: bridge
   ```

3. **Customize the deployment template**:
   - Replace `[APP_NAME]` with your app name
   - Replace `[APP_DIRECTORY]` with path to Dockerfile

4. **Set GitHub variables**:
   ```
   HOST=your-server-ip
   USERNAME=deploy
   APP_PORT=8202
   ```

### **Approach 2: Pre-configured Services Template**

**Best for**: Apps that commonly need MySQL + Redis

#### **How it works**:
1. Use the pre-configured template with built-in services
2. Configure via GitHub variables
3. All services included by default

#### **Steps**:

1. **Copy the services template**:
   ```bash
   curl -o .github/workflows/deploy-[APP_NAME].yml https://raw.githubusercontent.com/your-username/serversetup/main/scripts/deploy-with-services-template.yml
   ```

2. **Set GitHub variables**:
   ```
   HOST=your-server-ip
   USERNAME=deploy
   APP_PORT=8202
   DB_NAME=myappdb
   DB_USER=myappuser
   DB_PASSWORD=securepassword
   MYSQL_ROOT_PASSWORD=rootpassword
   ```

## 📋 **Common Service Configurations**

### **MySQL Database**
```yaml
mysql:
  image: mysql:8.0
  container_name: ${APP_NAME}-mysql
  environment:
    - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    - MYSQL_DATABASE=${DB_NAME}
    - MYSQL_USER=${DB_USER}
    - MYSQL_PASSWORD=${DB_PASSWORD}
  volumes:
    - mysql_data:/var/lib/mysql
  networks:
    - ${APP_NAME}-network
```

### **PostgreSQL Database**
```yaml
postgres:
  image: postgres:15-alpine
  container_name: ${APP_NAME}-postgres
  environment:
    - POSTGRES_DB=${DB_NAME}
    - POSTGRES_USER=${DB_USER}
    - POSTGRES_PASSWORD=${DB_PASSWORD}
  volumes:
    - postgres_data:/var/lib/postgresql/data
  networks:
    - ${APP_NAME}-network
```

### **Redis Cache**
```yaml
redis:
  image: redis:7-alpine
  container_name: ${APP_NAME}-redis
  networks:
    - ${APP_NAME}-network
```

### **MongoDB**
```yaml
mongodb:
  image: mongo:7
  container_name: ${APP_NAME}-mongodb
  environment:
    - MONGO_INITDB_ROOT_USERNAME=admin
    - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    - MONGO_INITDB_DATABASE=${DB_NAME}
  volumes:
    - mongodb_data:/data/db
  networks:
    - ${APP_NAME}-network
```

## 🔧 **Port Management for Multi-Container Apps**

### **Port Allocation Strategy**

| App | Main Port | Database Port | Redis Port | Notes |
|-----|-----------|---------------|------------|-------|
| monstermemory | 8201 | - | - | Simple app |
| todoapp | 8202 | - | 8203 | App + Redis |
| blog | 8204 | 8205 | 8206 | Full stack |
| api | 8207 | 8208 | 8209 | Backend services |

### **Port Guidelines**:
- **Main app port**: 8201, 8202, 8204, 8207, etc.
- **Database ports**: Usually not exposed (internal only)
- **Redis ports**: Usually not exposed (internal only)
- **Additional services**: Only expose if needed externally

## 🛠️ **Environment Variables**

### **Common Database Variables**
```bash
# GitHub Variables
DB_NAME=myappdb
DB_USER=myappuser
DB_PASSWORD=securepassword
MYSQL_ROOT_PASSWORD=rootpassword
```

### **Application Environment Variables**
```yaml
environment:
  # Database
  - DB_HOST=mysql
  - DB_PORT=3306
  - DB_NAME=${DB_NAME}
  - DB_USER=${DB_USER}
  - DB_PASSWORD=${DB_PASSWORD}
  
  # Redis
  - REDIS_HOST=redis
  - REDIS_PORT=6379
  
  # Application
  - NODE_ENV=production
  - JWT_SECRET=${JWT_SECRET}
  - API_KEY=${API_KEY}
```

## 🔒 **Security Considerations**

### **Database Security**
1. **Use strong passwords** in GitHub variables
2. **Don't expose database ports** externally
3. **Use internal networks** for service communication
4. **Regular backups** of persistent volumes

### **Secrets Management**
```bash
# GitHub Secrets (sensitive data)
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key

# GitHub Variables (configuration)
DB_NAME=myappdb
DB_USER=myappuser
```

## 📊 **Health Checks**

### **Application Health Check**
```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### **Database Health Check**
```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  interval: 30s
  timeout: 10s
  retries: 5
```

### **Redis Health Check**
```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 🚨 **Troubleshooting Multi-Container Deployments**

### **Common Issues**

1. **Services not starting in order**
   - Use `depends_on` with health check conditions
   - Increase `start_period` for complex apps

2. **Database connection failures**
   - Check network connectivity
   - Verify environment variables
   - Check database health status

3. **Port conflicts**
   - Each app gets its own network
   - Services communicate via container names
   - Only expose ports that need external access

### **Debug Commands**
```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Check service logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Check network connectivity
docker exec -it [app-container] ping mysql
docker exec -it [app-container] ping redis

# Check database connectivity
docker exec -it [app-container] mysql -h mysql -u appuser -p
```

## 📈 **Scaling Considerations**

### **Database Scaling**
- Use external managed databases for production
- Consider read replicas for high-traffic apps
- Implement connection pooling

### **Application Scaling**
- Use load balancers for multiple app instances
- Implement session storage in Redis
- Use external cache services

## 🎯 **Best Practices**

1. **Use custom docker-compose files** for complex setups
2. **Keep services in separate containers** for better isolation
3. **Use health checks** for proper startup ordering
4. **Store sensitive data in GitHub secrets**
5. **Use internal networks** for service communication
6. **Implement proper logging** for debugging
7. **Regular backups** of persistent data

---

**This approach gives you complete flexibility for any multi-container application!** 🚀

