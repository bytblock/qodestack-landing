---
title: "Monitoring and Observability for Distributed Systems"
date: "2024-07-05"
excerpt: "Build comprehensive observability into your distributed systems with metrics, logs, and traces. Learn to detect issues before users do."
tags: ["DevOps", "Monitoring", "Observability", "Infrastructure"]
---

"It's not down for me" is the worst response to an outage. Proper observability means you know about issues before your users do. This guide covers building production-ready monitoring for distributed systems.

## The Three Pillars

### 1. Metrics (What's happening?)

Numeric measurements over time: CPU usage, request rate, error rate, response time.

### 2. Logs (What happened?)

Timestamped records of discrete events: errors, warnings, user actions.

### 3. Traces (Where did time go?)

Request flow across services: which service is slow, where are bottlenecks?

## Stack Overview

```
┌─────────────┐
│ Application │
└──────┬──────┘
       │ Metrics, Logs, Traces
       ▼
┌─────────────────────────────┐
│   Prometheus (Metrics)      │
│   Loki (Logs)               │
│   Jaeger (Traces)           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Grafana (Visualization)   │
└─────────────────────────────┘
```

## Metrics with Prometheus

### Node.js Application

```bash
npm install prom-client express
```

```javascript
// metrics.js
const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Enable default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);

module.exports = {
  register,
  httpRequestDuration,
  httpRequestTotal,
  activeConnections,
};
```

```javascript
// app.js
const express = require('express');
const { register, httpRequestDuration, httpRequestTotal } = require('./metrics');

const app = express();

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);

    httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });

  next();
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.get('/api/users', (req, res) => {
  // Your route logic
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'api'
    static_configs:
      - targets: ['api:3000']
        labels:
          service: 'api'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
        labels:
          service: 'postgres'

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
        labels:
          service: 'redis'

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
        labels:
          service: 'system'
```

## Logging with Winston + Loki

```bash
npm install winston winston-loki
```

```javascript
// logger.js
const winston = require('winston');
const LokiTransport = require('winston-loki');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'api',
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),

    // Loki
    new LokiTransport({
      host: process.env.LOKI_HOST || 'http://loki:3100',
      labels: { app: 'api' },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    }),
  ],
});

module.exports = logger;
```

```javascript
// Usage
const logger = require('./logger');

app.get('/api/users', async (req, res) => {
  logger.info('Fetching users', {
    userId: req.user?.id,
    ip: req.ip,
  });

  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    logger.error('Failed to fetch users', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Distributed Tracing with Jaeger

```bash
npm install @opentelemetry/api \
            @opentelemetry/sdk-node \
            @opentelemetry/auto-instrumentations-node \
            @opentelemetry/exporter-jaeger
```

```javascript
// tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'api',
});

sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

module.exports = sdk;
```

```javascript
// app.js
require('./tracing'); // Must be first!

const express = require('express');
const app = express();

// Your routes - automatically instrumented!
app.get('/api/users', async (req, res) => {
  const users = await fetchUsers(); // Traced automatically
  res.json(users);
});
```

## Docker Compose Setup

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - LOKI_HOST=http://loki:3100
      - JAEGER_ENDPOINT=http://jaeger:14268/api/traces
    depends_on:
      - postgres
      - redis
      - loki
      - jaeger

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    depends_on:
      - prometheus
      - loki

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686" # UI
      - "14268:14268" # Collector
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"

  postgres-exporter:
    image: prometheuscommunity/postgres-exporter
    environment:
      - DATA_SOURCE_NAME=postgresql://user:password@postgres:5432/mydb?sslmode=disable

  redis-exporter:
    image: oliver006/redis_exporter
    environment:
      - REDIS_ADDR=redis:6379

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
```

## Grafana Dashboards

### Datasources Configuration

```yaml
# grafana/datasources/datasources.yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100

  - name: Jaeger
    type: jaeger
    access: proxy
    url: http://jaeger:16686
```

### Sample Dashboard (JSON)

```json
{
  "dashboard": {
    "title": "API Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "{{route}}"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Response Time (P95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{route}}"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

## Alerting

```yaml
# prometheus/alerts.yml
groups:
  - name: api
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/second"

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response time"
          description: "P95 latency is {{ $value }} seconds"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 500
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }}MB"
```

## Best Practices

### 1. Structured Logging

```javascript
// BAD
logger.info('User logged in: ' + userId);

// GOOD
logger.info('User logged in', {
  userId,
  ip: req.ip,
  userAgent: req.get('user-agent'),
});
```

### 2. Metric Naming

```javascript
// Use standard naming conventions
const metricName = 'http_request_duration_seconds'; // seconds, not milliseconds

// Include relevant labels
metric.labels({
  method: req.method,
  route: req.route.path,
  status: res.statusCode,
});
```

### 3. Correlation IDs

```javascript
const { v4: uuidv4 } = require('uuid');

app.use((req, res, next) => {
  req.id = req.get('X-Request-ID') || uuidv4();
  res.set('X-Request-ID', req.id);
  next();
});

app.use((req, res, next) => {
  logger.defaultMeta = { ...logger.defaultMeta, requestId: req.id };
  next();
});
```

### 4. Health Checks

```javascript
app.get('/health', async (req, res) => {
  try {
    // Check database
    await pool.query('SELECT 1');

    // Check Redis
    await redis.ping();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      redis: 'connected',
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});
```

## Conclusion

Observability is not optional in production. The upfront investment in monitoring saves countless hours during incidents and improves system reliability.

**Key Takeaways:**
- Implement all three pillars: metrics, logs, traces
- Use correlation IDs to connect events across services
- Alert on symptoms, not causes
- Make dashboards actionable
- Test your monitoring (chaos engineering)

---

*Need help implementing observability? [Contact Qodestack](/contact) for infrastructure consulting.*
