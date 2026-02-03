---
title: "Production Kubernetes Deployment: Complete Guide from Development to Scale"
excerpt: "A comprehensive guide to deploying applications on Kubernetes in production, covering everything from cluster setup to monitoring, scaling, and cost optimization."
date: "2024-06-15"
author: "Qodestack Team"
tags: ["kubernetes", "devops", "deployment", "production", "infrastructure"]
---

Kubernetes has become the de facto standard for container orchestration, but moving from development to production requires careful planning and implementation. This guide covers everything you need to know to deploy production-ready applications on Kubernetes.

## Table of Contents

1. Cluster Architecture & Setup
2. Application Deployment Strategies
3. Configuration Management
4. Storage & StatefulSets
5. Networking & Service Mesh
6. Monitoring & Observability
7. Security Best Practices
8. Scaling & Performance
9. Cost Optimization
10. Disaster Recovery

## 1. Cluster Architecture & Setup

### Choosing a Kubernetes Distribution

For production workloads, you have several options:

**Managed Solutions:**
- **Amazon EKS**: Best AWS integration, automatic control plane upgrades
- **Google GKE**: Most mature managed K8s, autopilot mode
- **Azure AKS**: Good for Microsoft stack, free control plane

**Self-Managed:**
- **kubeadm**: Vanilla Kubernetes, full control
- **kops**: Production-grade K8s on AWS
- **Rancher**: Enterprise features, multi-cluster management

**Our Recommendation:** Start with managed services (EKS/GKE) unless you have specific requirements for self-hosting.

### Production Cluster Architecture

A production-ready cluster should have:

```yaml
# Recommended architecture for production
Control Plane:
  - High availability (3 nodes minimum)
  - Spread across availability zones
  - Automated backups of etcd
  - Separate from workload nodes

Worker Nodes:
  - Multiple node groups by workload type
  - Spot instances for cost savings (non-critical workloads)
  - Autoscaling enabled (Cluster Autoscaler)
  - Appropriate instance types per workload

Networking:
  - VPC with private subnets
  - NAT gateway for outbound traffic
  - Network policies enabled
  - Service mesh consideration (Linkerd/Istio)
```

### Setting up EKS with Terraform

```hcl
# terraform/eks.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "production-cluster"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # Enable IRSA (IAM Roles for Service Accounts)
  enable_irsa = true

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
      most_recent              = true
      service_account_role_arn = module.ebs_csi_driver_irsa.iam_role_arn
    }
  }

  # Managed node groups
  eks_managed_node_groups = {
    # General purpose nodes
    general = {
      name            = "general"
      instance_types  = ["t3.xlarge"]
      capacity_type   = "ON_DEMAND"

      min_size     = 3
      max_size     = 10
      desired_size = 3

      labels = {
        workload = "general"
      }

      tags = {
        "k8s.io/cluster-autoscaler/enabled" = "true"
        "k8s.io/cluster-autoscaler/production-cluster" = "owned"
      }
    }

    # Spot instances for non-critical workloads
    spot = {
      name            = "spot"
      instance_types  = ["t3.large", "t3a.large"]
      capacity_type   = "SPOT"

      min_size     = 2
      max_size     = 20
      desired_size = 5

      labels = {
        workload = "spot"
      }

      taints = [{
        key    = "spot"
        value  = "true"
        effect = "NoSchedule"
      }]
    }

    # Compute-intensive nodes
    compute = {
      name            = "compute"
      instance_types  = ["c5.2xlarge"]
      capacity_type   = "ON_DEMAND"

      min_size     = 1
      max_size     = 5
      desired_size = 2

      labels = {
        workload = "compute"
      }

      taints = [{
        key    = "compute"
        value  = "true"
        effect = "NoSchedule"
      }]
    }
  }

  # Cluster security group rules
  cluster_security_group_additional_rules = {
    ingress_nodes_ephemeral = {
      description                = "Nodes on ephemeral ports"
      protocol                   = "tcp"
      from_port                  = 1025
      to_port                    = 65535
      type                       = "ingress"
      source_node_security_group = true
    }
  }

  tags = {
    Environment = "production"
    Terraform   = "true"
  }
}
```

## 2. Application Deployment Strategies

### Blue-Green Deployments

Blue-green deployments eliminate downtime by running two identical environments.

```yaml
# blue-green-deployment.yaml
# Blue deployment (currently serving traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: myapp
        image: myapp:v1.0
        ports:
        - containerPort: 8080
---
# Green deployment (new version)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: myapp
        image: myapp:v2.0
        ports:
        - containerPort: 8080
---
# Service pointing to blue initially
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
    version: blue  # Switch to 'green' to cut over
  ports:
  - port: 80
    targetPort: 8080
```

**Cutover process:**
1. Deploy green with new version
2. Test green deployment
3. Update service selector from `blue` to `green`
4. Monitor for issues
5. If successful, delete blue deployment
6. If issues, revert service to blue

### Canary Deployments

Gradually roll out changes to a subset of users.

```yaml
# Using Flagger for automated canary deployments
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: myapp
  namespace: production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  service:
    port: 80
    targetPort: 8080
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
      interval: 1m
    - name: request-duration
      thresholdRange:
        max: 500
      interval: 1m
  webhooks:
  - name: load-test
    url: http://loadtester.test/
    timeout: 5s
    metadata:
      cmd: "hey -z 1m -q 10 -c 2 http://myapp-canary.production/"
```

### Rolling Updates with Health Checks

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max extra pods during update
      maxUnavailable: 1  # Max unavailable pods
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 8080

        # Liveness probe - restart if unhealthy
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3

        # Readiness probe - remove from service if not ready
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2

        # Startup probe - for slow-starting apps
        startupProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 0
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 30  # 5 minutes to start

        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi

        # Graceful shutdown
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 15"]
```

## 3. Configuration Management

### Externalize Configuration with ConfigMaps

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
data:
  app.properties: |
    server.port=8080
    log.level=info
    database.pool.size=10

  nginx.conf: |
    server {
      listen 80;
      location / {
        proxy_pass http://backend:8080;
      }
    }
---
# Using ConfigMap in deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:latest

        # Environment variables from ConfigMap
        env:
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: myapp-config
              key: log.level

        # Mount entire config file
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true

      volumes:
      - name: config
        configMap:
          name: myapp-config
```

### Secure Secrets with External Secrets Operator

Instead of storing secrets directly in Kubernetes, use External Secrets Operator to sync from AWS Secrets Manager, GCP Secret Manager, or Azure Key Vault.

```yaml
# Install External Secrets Operator
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace

# Configure SecretStore
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets
  namespace: production
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa

---
# ExternalSecret that syncs from AWS
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-credentials
  namespace: production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets
    kind: SecretStore
  target:
    name: database-credentials
    creationPolicy: Owner
  data:
  - secretKey: username
    remoteRef:
      key: prod/database
      property: username
  - secretKey: password
    remoteRef:
      key: prod/database
      property: password
```

### Kustomize for Environment-Specific Configs

```yaml
# base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
- configmap.yaml

---
# overlays/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
- ../../base

replicas:
- name: myapp
  count: 5

images:
- name: myapp
  newTag: v1.2.3

patches:
- patch: |-
    - op: replace
      path: /spec/template/spec/containers/0/resources/requests/memory
      value: 512Mi
  target:
    kind: Deployment
    name: myapp

configMapGenerator:
- name: myapp-config
  behavior: merge
  literals:
  - LOG_LEVEL=info
  - ENVIRONMENT=production
```

Apply with:
```bash
kubectl apply -k overlays/production
```

## 4. Storage & StatefulSets

### StatefulSets for Databases

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        ports:
        - containerPort: 5432
          name: postgres
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            cpu: 500m
            memory: 2Gi
          limits:
            cpu: 2
            memory: 4Gi

  # Volume claim template
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: gp3
      resources:
        requests:
          storage: 100Gi
```

### Dynamic Volume Provisioning

```yaml
# StorageClass for fast SSD storage
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  encrypted: "true"
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
---
# PersistentVolumeClaim
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myapp-storage
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 50Gi
```

## 5. Networking & Service Mesh

### Ingress with TLS

```yaml
# Install ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

# Ingress resource
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 80
```

### Service Mesh with Linkerd

```bash
# Install Linkerd
linkerd install --crds | kubectl apply -f -
linkerd install | kubectl apply -f -
linkerd viz install | kubectl apply -f -

# Inject into namespace
kubectl annotate namespace production linkerd.io/inject=enabled

# All new pods in production namespace get Linkerd proxy
```

Benefits:
- Automatic mTLS between services
- Traffic splitting for canary deployments
- Detailed metrics and tracing
- Retries and timeouts
- Load balancing

### Network Policies

```yaml
# Default deny all ingress
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
---
# Allow specific traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

## 6. Monitoring & Observability

### Prometheus & Grafana Stack

```bash
# Install kube-prometheus-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values prometheus-values.yaml
```

```yaml
# prometheus-values.yaml
prometheus:
  prometheusSpec:
    retention: 30d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          resources:
            requests:
              storage: 100Gi

grafana:
  adminPassword: your-secure-password
  ingress:
    enabled: true
    hosts:
    - grafana.example.com
    tls:
    - secretName: grafana-tls
      hosts:
      - grafana.example.com

alertmanager:
  alertmanagerSpec:
    storage:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          resources:
            requests:
              storage: 10Gi
```

### Application Metrics

```go
// Example in Go
import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )

    httpDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name: "http_request_duration_seconds",
            Help: "HTTP request duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "endpoint"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
    prometheus.MustRegister(httpDuration)
}

// Expose metrics endpoint
http.Handle("/metrics", promhttp.Handler())
```

### Distributed Tracing with Jaeger

```bash
# Install Jaeger Operator
kubectl create namespace observability
kubectl apply -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.51.0/jaeger-operator.yaml -n observability

# Deploy Jaeger instance
kubectl apply -f - <<EOF
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: jaeger
  namespace: observability
spec:
  strategy: production
  storage:
    type: elasticsearch
    options:
      es:
        server-urls: http://elasticsearch:9200
EOF
```

## 7. Security Best Practices

### Pod Security Standards

```yaml
# Enforce restricted pod security
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### RBAC Configuration

```yaml
# ServiceAccount for application
apiVersion: v1
kind: ServiceAccount
metadata:
  name: myapp-sa
  namespace: production
---
# Role with minimal permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: myapp-role
  namespace: production
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list"]
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["myapp-secret"]
  verbs: ["get"]
---
# RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: myapp-binding
  namespace: production
subjects:
- kind: ServiceAccount
  name: myapp-sa
roleRef:
  kind: Role
  name: myapp-role
  apiGroup: rbac.authorization.k8s.io
```

### Security Context

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
        seccompProfile:
          type: RuntimeDefault

      containers:
      - name: myapp
        image: myapp:latest
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
            - ALL
          readOnlyRootFilesystem: true

        volumeMounts:
        - name: tmp
          mountPath: /tmp

      volumes:
      - name: tmp
        emptyDir: {}
```

## 8. Scaling & Performance

### Horizontal Pod Autoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 3
  maxReplicas: 100
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
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 15
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 15
      selectPolicy: Max
```

### Vertical Pod Autoscaler (VPA)

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: myapp
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  updatePolicy:
    updateMode: "Auto"  # or "Recreate", "Initial", "Off"
  resourcePolicy:
    containerPolicies:
    - containerName: myapp
      minAllowed:
        cpu: 100m
        memory: 256Mi
      maxAllowed:
        cpu: 2
        memory: 4Gi
```

### Cluster Autoscaler

```bash
# Install Cluster Autoscaler
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

# Configure for your cluster
kubectl -n kube-system edit deployment cluster-autoscaler

# Add these command args:
# --balance-similar-node-groups
# --skip-nodes-with-system-pods=false
# --scale-down-utilization-threshold=0.5
```

## 9. Cost Optimization

### Use Spot Instances

```yaml
# Tolerate spot interruptions
apiVersion: apps/v1
kind: Deployment
metadata:
  name: batch-processor
spec:
  template:
    spec:
      tolerations:
      - key: "spot"
        operator: "Equal"
        value: "true"
        effect: "NoSchedule"

      nodeSelector:
        workload: "spot"

      # Handle interruptions gracefully
      terminationGracePeriodSeconds: 30
```

### Resource Limits and Requests

```yaml
# Properly size your pods
resources:
  requests:
    cpu: 100m      # Guaranteed CPU
    memory: 256Mi  # Guaranteed memory
  limits:
    cpu: 500m      # Maximum CPU (can burst)
    memory: 512Mi  # Hard memory limit (OOM if exceeded)
```

### Cluster Bin Packing

```yaml
# Priority class for critical workloads
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "High priority for critical services"
---
# Use in deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: critical-service
spec:
  template:
    spec:
      priorityClassName: high-priority
```

## 10. Disaster Recovery

### etcd Backups

```bash
# Automated etcd backups (EKS example)
kubectl create -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: etcd-backup
  namespace: kube-system
spec:
  schedule: "0 */6 * * *"  # Every 6 hours
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: etcd-backup
          containers:
          - name: backup
            image: amazon/aws-cli
            command:
            - /bin/sh
            - -c
            - |
              kubectl get all --all-namespaces -o yaml > /tmp/cluster-state.yaml
              aws s3 cp /tmp/cluster-state.yaml s3://my-backups/etcd/\$(date +%Y%m%d-%H%M%S).yaml
          restartPolicy: OnFailure
EOF
```

### Velero for Cluster Backups

```bash
# Install Velero
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.8.0 \
  --bucket velero-backups \
  --secret-file ./credentials-velero \
  --backup-location-config region=us-east-1 \
  --snapshot-location-config region=us-east-1

# Create backup schedule
velero schedule create daily-backup --schedule="0 2 * * *"

# Backup specific namespace
velero backup create production-backup --include-namespaces production

# Restore from backup
velero restore create --from-backup production-backup
```

## Conclusion

Deploying production-ready applications on Kubernetes requires attention to:

1. **High Availability**: Multi-zone deployments, pod disruption budgets
2. **Security**: RBAC, network policies, pod security standards
3. **Observability**: Comprehensive monitoring, logging, and tracing
4. **Scalability**: HPA, VPA, cluster autoscaler
5. **Cost Optimization**: Spot instances, right-sizing, bin packing
6. **Disaster Recovery**: Automated backups, tested restore procedures

Start small, iterate, and gradually add complexity as your needs grow. The Kubernetes ecosystem is vast, but with these foundations, you'll be well-equipped to run production workloads reliably and efficiently.

## Additional Resources

- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [CNCF Landscape](https://landscape.cncf.io/)
- [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/)
- [12 Factor App](https://12factor.net/)
- [Production Ready Checklist](https://learnk8s.io/production-best-practices)

---

*Have questions about Kubernetes deployments? [Contact us](/contact) for a consultation.*
