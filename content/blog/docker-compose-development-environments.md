---
title: "Docker Compose for Development Environments"
date: "2025-01-20"
excerpt: "Best practices for using Docker Compose to create reproducible, production-like development environments with PostgreSQL, Redis, and monitoring."
tags: ["Docker", "DevOps", "Infrastructure", "Development"]
---

Docker Compose transforms development workflow by providing consistent, reproducible environments that mirror production. This guide covers practical patterns for building robust development stacks.

## Why Docker Compose?

Traditional development faces common problems:
- "Works on my machine" syndrome
- Complex setup documentation
- Version mismatches between team members
- Difficulty replicating production environments

Docker Compose solves these by defining your entire stack in a single `docker-compose.yml` file.

## Basic Structure

A minimal Docker Compose setup:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
```

Key concepts:
- **Services**: Containers that make up your application
- **Ports**: Map container ports to host
- **Volumes**: Mount code for live reloading
- **Environment**: Configuration variables

## Database Services

### PostgreSQL

Production-grade PostgreSQL setup:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U developer"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Features:
- Alpine image for smaller size
- Health checks ensure database is ready
- Init scripts run on first start
- Named volumes persist data between restarts

### Redis

In-memory cache and message broker:

```yaml
services:
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  redis_data:
```

The `--appendonly yes` flag enables persistence.

## Application Services

### Node.js Application

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://developer:devpassword@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run dev
```

Key patterns:
- **depends_on with conditions**: Wait for databases to be healthy
- **Volume exclusions**: `/app/node_modules` prevents host override
- **Development command**: Override default with dev server

### Development Dockerfile

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

Multi-stage builds for production:

```dockerfile
# Dockerfile (production)
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm ci --production

EXPOSE 3000
CMD ["npm", "start"]
```

## Monitoring Stack

### Prometheus

Metrics collection:

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

volumes:
  prometheus_data:
```

Configuration file:

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
```

### Grafana

Visualization and dashboards:

```yaml
services:
  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    depends_on:
      - prometheus

volumes:
  grafana_data:
```

## Networking

### Custom Networks

Isolate services with networks:

```yaml
services:
  app:
    networks:
      - frontend
      - backend

  postgres:
    networks:
      - backend

  nginx:
    networks:
      - frontend

networks:
  frontend:
  backend:
```

Only `app` can communicate with both `nginx` and `postgres`.

### Service Discovery

Services communicate using service names:

```javascript
// app connects to postgres using service name
const pool = new Pool({
  host: 'postgres', // Service name, not localhost
  port: 5432,
  database: 'myapp'
})
```

Docker's internal DNS resolves service names to container IPs.

## Development Workflow

### Quick Commands

Create shell aliases for common operations:

```bash
# ~/.bashrc
alias dc="docker compose"
alias dcu="docker compose up -d"
alias dcd="docker compose down"
alias dcl="docker compose logs -f"
alias dce="docker compose exec"
```

### Common Operations

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f app

# Execute commands in containers
docker compose exec app npm test
docker compose exec postgres psql -U developer myapp

# Restart a service
docker compose restart app

# Rebuild after dependency changes
docker compose up -d --build

# Stop and remove everything
docker compose down -v
```

## Production-Like Setup

Full stack with load balancing:

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app

  app:
    build: .
    restart: unless-stopped
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Nginx configuration for load balancing:

```nginx
upstream app {
    server app:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Environment Variables

### Using .env Files

```bash
# .env
DATABASE_URL=postgresql://developer:devpassword@postgres:5432/myapp
REDIS_URL=redis://redis:6379
API_KEY=secret
```

```yaml
services:
  app:
    env_file:
      - .env
```

### Multiple Environments

```bash
# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://dev:dev@postgres:5432/myapp

# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://prod:${DB_PASSWORD}@postgres:5432/myapp
```

Use with:

```bash
docker compose --env-file .env.production up
```

## Health Checks

Ensure services are ready:

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  // Check database connection
  const dbHealthy = await checkDatabase()
  const redisHealthy = await checkRedis()

  if (!dbHealthy || !redisHealthy) {
    return new Response('Unhealthy', { status: 503 })
  }

  return new Response('OK', { status: 200 })
}
```

## Cleanup and Maintenance

### Remove Unused Resources

```bash
# Remove stopped containers, unused networks, dangling images
docker system prune

# Remove all unused volumes (CAUTION: deletes data)
docker volume prune

# Remove specific volume
docker volume rm myapp_postgres_data
```

### Reset Everything

```bash
# Stop and remove containers, networks, volumes
docker compose down -v

# Remove all images
docker compose down --rmi all

# Fresh start
docker compose up -d --build
```

## Best Practices

1. **Version control**: Commit `docker-compose.yml`, ignore `.env`
2. **Named volumes**: Persist data between container restarts
3. **Health checks**: Ensure services are ready before dependents start
4. **Restart policies**: Use `unless-stopped` for persistent services
5. **Resource limits**: Prevent containers from consuming all resources

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

6. **Logging**: Configure log drivers for production

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Conclusion

Docker Compose streamlines development by providing:
- Consistent environments across team members
- Easy onboarding for new developers
- Production parity
- Isolated service dependencies

Start with a simple setup and expand as needs grow. The investment in proper Docker Compose configuration pays dividends in reduced debugging and setup time.
