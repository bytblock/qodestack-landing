---
title: "Kubernetes Migration for SaaS Platform"
category: "DevOps & Infrastructure"
client: "B2B SaaS Company"
challenge: "Migrating monolithic app to Kubernetes microservices"
excerpt: "Reduced infrastructure costs by 40% while improving deployment velocity"
tags: ["Kubernetes", "Terraform", "AWS", "GitOps", "ArgoCD", "Helm"]
date: "2024-04-05"
---

## The Challenge

A B2B SaaS company with 5,000+ customers was struggling with their monolithic application hosted on traditional EC2 instances. Their infrastructure was becoming increasingly difficult to scale, deploy, and maintain.

**Key Problems:**
- Monolithic Node.js application (150K+ lines of code)
- Manual deployment process taking 2-3 hours
- Frequent downtime during deployments (30-60 minutes)
- Inability to scale individual components independently
- Over-provisioned infrastructure wasting ~$8K/month
- Development team blocked by slow iteration cycles
- No rollback mechanism for failed deployments
- Limited observability and debugging capabilities

**Requirements:**
- Zero-downtime deployments
- Automated CI/CD pipeline
- Ability to scale services independently
- 40% cost reduction target
- Improve deployment frequency from weekly to daily
- Complete migration within 3 months
- Maintain data consistency throughout migration
- Minimal disruption to customers

## Our Solution

We executed a phased migration from a monolithic architecture to a Kubernetes-based microservices platform with comprehensive automation and observability.

### Architecture Overview

**Before (Monolithic):**
- Single EC2 instance (c5.4xlarge) running Node.js app
- Separate RDS PostgreSQL database
- Redis on separate EC2 instance
- ALB for load balancing
- Manual deployments via SSH

**After (Kubernetes):**
- Amazon EKS cluster (3 availability zones)
- 12 microservices (authentication, billing, notifications, etc.)
- Service mesh (Linkerd) for traffic management
- GitOps with ArgoCD for deployments
- Horizontal Pod Autoscaling (HPA)
- Managed RDS (no change)
- ElastiCache Redis cluster
- External Secrets Operator for secure secret management

### Technology Stack

- **Kubernetes (EKS)**: Container orchestration
- **Terraform**: Infrastructure as Code
- **ArgoCD**: GitOps continuous delivery
- **Helm**: Kubernetes package manager
- **Linkerd**: Service mesh
- **Prometheus + Grafana**: Monitoring
- **Loki**: Log aggregation
- **GitHub Actions**: CI/CD pipeline
- **Kustomize**: Kubernetes manifest management

## Implementation Process

### Phase 1: Planning & Service Decomposition (Week 1-2)

**Service Boundary Analysis:**

We analyzed the monolith and identified 12 logical service boundaries:

```
1. Auth Service - Authentication and authorization
2. User Service - User profile management
3. Billing Service - Subscription and payment processing
4. Notification Service - Email, SMS, push notifications
5. API Gateway - Request routing and rate limiting
6. Reporting Service - Analytics and reports
7. Integration Service - Third-party API integrations
8. File Service - File upload and storage
9. Search Service - Full-text search
10. Webhook Service - Outbound webhook delivery
11. Scheduler Service - Cron jobs and background tasks
12. Admin Service - Internal admin dashboard
```

**Data Decomposition Strategy:**
- Shared database initially (to reduce risk)
- Plan for database-per-service migration in Phase 2
- Event-driven communication via Redis Streams
- Saga pattern for distributed transactions

### Phase 2: Infrastructure Setup (Week 3-4)

**Terraform Configuration:**

```hcl
# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.0"

  cluster_name    = "saas-platform-prod"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      desired_size = 3
      min_size     = 3
      max_size     = 10

      instance_types = ["t3.large"]
      capacity_type  = "SPOT" # 70% cost savings

      labels = {
        role = "general"
      }

      taints = []
    }

    compute = {
      desired_size = 2
      min_size     = 2
      max_size     = 8

      instance_types = ["c5.xlarge"]
      capacity_type  = "SPOT"

      labels = {
        role = "compute"
      }

      taints = [{
        key    = "compute"
        value  = "true"
        effect = "NoSchedule"
      }]
    }
  }

  # Cluster addons
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  tags = {
    Environment = "production"
    Terraform   = "true"
  }
}

# RDS (existing, no changes)
# ElastiCache Redis
module "redis" {
  source = "terraform-aws-modules/elasticache/aws"

  cluster_id               = "saas-platform-redis"
  engine                   = "redis"
  node_type                = "cache.r6g.large"
  num_cache_nodes          = 2
  parameter_group_family   = "redis7"
  engine_version           = "7.0"
  port                     = 6379
  subnet_ids               = module.vpc.private_subnets
  security_group_ids       = [aws_security_group.redis.id]
  automatic_failover_enabled = true
}
```

**GitOps Setup with ArgoCD:**

```yaml
# argocd/applications/auth-service.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: auth-service
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/company/k8s-manifests
    targetRevision: main
    path: services/auth
    helm:
      valueFiles:
        - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### Phase 3: Strangler Fig Migration (Week 5-10)

We used the Strangler Fig pattern to gradually migrate functionality from the monolith to microservices.

**Week 5-6: Extract Auth Service**

```typescript
// auth-service/src/index.ts
import express from 'express'
import { verifyToken, login, register } from './auth'

const app = express()

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await login(email, password)
    res.json(result)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

app.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  const result = await register(email, password, name)
  res.status(201).json(result)
})

app.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  const user = await verifyToken(token)
  res.json({ user })
})

app.listen(3000, () => {
  console.log('Auth service running on port 3000')
})
```

**Kubernetes Deployment:**

```yaml
# auth-service/k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: registry.company.com/auth-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-credentials
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secrets
              key: jwt-secret
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: production
spec:
  selector:
    app: auth-service
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

**Week 7-10: Extract Remaining Services**

Repeated the process for other services:
- User Service (Week 7)
- Notification Service (Week 7)
- Billing Service (Week 8)
- Reporting Service (Week 8)
- Integration Service (Week 9)
- File Service (Week 9)
- Remaining services (Week 10)

**API Gateway for Request Routing:**

```typescript
// api-gateway/src/routes.ts
import { createProxyMiddleware } from 'http-proxy-middleware'

export const routes = [
  {
    path: '/api/auth',
    target: 'http://auth-service.production.svc.cluster.local',
    changeOrigin: true
  },
  {
    path: '/api/users',
    target: 'http://user-service.production.svc.cluster.local',
    changeOrigin: true
  },
  {
    path: '/api/billing',
    target: 'http://billing-service.production.svc.cluster.local',
    changeOrigin: true
  },
  // ... more routes
]

// Apply middleware
routes.forEach(route => {
  app.use(route.path, createProxyMiddleware({
    target: route.target,
    changeOrigin: route.changeOrigin,
    pathRewrite: {
      [`^${route.path}`]: ''
    }
  }))
})
```

### Phase 4: CI/CD Pipeline (Week 11)

**GitHub Actions Workflow:**

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
    paths:
      - 'services/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: registry.company.com
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./services/auth-service
          push: true
          tags: registry.company.com/auth-service:${{ github.sha }}
          cache-from: type=registry,ref=registry.company.com/auth-service:buildcache
          cache-to: type=registry,ref=registry.company.com/auth-service:buildcache,mode=max

      - name: Update manifest
        run: |
          cd k8s-manifests
          kustomize edit set image auth-service=registry.company.com/auth-service:${{ github.sha }}
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add .
          git commit -m "Update auth-service to ${{ github.sha }}"
          git push
```

**ArgoCD automatically deploys changes:**
- Watches k8s-manifests repository
- Detects changes and syncs to cluster
- Performs rolling updates with zero downtime
- Automatic rollback on failures

### Phase 5: Observability (Week 12)

**Prometheus Metrics:**

```typescript
// Add to each service
import client from 'prom-client'

const register = new client.Registry()

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
})

register.registerMetric(httpRequestDuration)

// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration)
  })

  next()
})

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})
```

**Grafana Dashboards:**
- Service-level SLIs (latency, error rate, throughput)
- Infrastructure metrics (CPU, memory, network)
- Business metrics (active users, transactions, revenue)
- Cost tracking and optimization opportunities

## Results

### Performance Improvements

**Before Migration:**
- Deployment time: 2-3 hours
- Deployment frequency: Weekly
- Downtime per deployment: 30-60 minutes
- Recovery time from failure: 1-2 hours
- Average API response time: 450ms (p95)
- Error rate: 2.3%

**After Migration:**
- Deployment time: 8 minutes (auto)
- Deployment frequency: Multiple times daily
- Downtime per deployment: 0 minutes
- Recovery time from failure: <2 minutes (auto-rollback)
- Average API response time: 180ms (p95) - 60% improvement
- Error rate: 0.4% - 83% improvement

### Cost Analysis

**Before (Monthly):**
- EC2 instances: $12,000
- RDS: $800
- Redis (EC2): $400
- ELB: $100
- **Total: $13,300/month**

**After (Monthly):**
- EKS control plane: $73
- Worker nodes (Spot): $4,200
- RDS: $800
- ElastiCache: $350
- ELB: $120
- **Total: $5,543/month**

**Savings: $7,757/month (58% reduction)**
- Exceeded 40% cost reduction target
- Annual savings: $93,084

### Development Velocity

**Before:**
- Time to production: 2 weeks
- Blocked by deployment schedule
- Fear of breaking changes
- Manual testing required

**After:**
- Time to production: Same day
- Deploy anytime via Git push
- Canary deployments reduce risk
- Automated testing in CI/CD

**Impact:**
- Feature delivery 5x faster
- Increased developer satisfaction
- Reduced context switching
- More experimentation and innovation

### Reliability Improvements

**Before:**
- Uptime: 99.2% (7.3 hours downtime/month)
- Incidents per month: 8-12
- MTTR: 2-4 hours

**After:**
- Uptime: 99.95% (22 minutes downtime/month)
- Incidents per month: 1-2
- MTTR: <15 minutes (auto-healing)

**Availability increased by 0.75% (4.6x reduction in downtime)**

## Technical Highlights

### Auto-Scaling Success

Horizontal Pod Autoscaler (HPA) handles traffic spikes:

- **Black Friday traffic spike** (5x normal load)
  - Scaled from 15 to 67 pods automatically
  - Zero degradation in service
  - Scaled back down within 20 minutes after spike

### Cost Optimization Techniques

1. **Spot Instances**: 70% savings on compute
2. **Right-sizing**: Reduced over-provisioning
3. **Autoscaling**: Only pay for what you use
4. **Resource requests/limits**: Prevent waste
5. **Cluster Autoscaler**: Add/remove nodes dynamically

### Security Enhancements

- **Pod Security Standards**: Enforced across cluster
- **Network Policies**: Restrict inter-service communication
- **External Secrets Operator**: Secrets from AWS Secrets Manager
- **Service mesh (Linkerd)**: mTLS for all service-to-service communication
- **OPA (Open Policy Agent)**: Policy enforcement

## Client Testimonial

> "The Kubernetes migration was a game-changer for our business. Not only did we cut infrastructure costs in half, but our engineering team is now deploying features multiple times per day instead of weekly. The reliability improvements have been remarkable - we went from regular customer complaints about downtime to virtually none. Qodestak's expertise made what seemed like an impossible migration smooth and successful." - CTO, B2B SaaS Company

## Lessons Learned

1. **Strangler Fig pattern works** - Incremental migration reduced risk
2. **GitOps is powerful** - ArgoCD eliminated deployment errors
3. **Spot instances are viable** - With proper architecture, 70% cost savings
4. **Observability is critical** - Invested early, paid off immediately
5. **Team training matters** - Invested in Kubernetes training for client's team
6. **Start with shared database** - Full data decomposition can come later
7. **Automate everything** - Manual processes are error-prone and slow

## Future Enhancements

The client is now planning:

- **Service mesh upgrade** to Istio for advanced traffic management
- **Database-per-service** migration for better isolation
- **Multi-region deployment** for global customers
- **Event-driven architecture** with Kafka for better scalability
- **Serverless functions** (Knative) for event processing
- **AI/ML pipelines** on Kubernetes with Kubeflow

---

**Project Duration:** 12 weeks
**Technologies:** Kubernetes, Terraform, ArgoCD, Linkerd, Helm, Prometheus
**Infrastructure Cost Reduction:** 58% ($93K/year)
**Deployment Frequency:** Weekly → Multiple times daily
**Uptime Improvement:** 99.2% → 99.95%
**Current Status:** Production (8 months, stable)
