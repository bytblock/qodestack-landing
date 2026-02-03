---
title: "Enterprise Ethereum RPC Infrastructure"
category: "Blockchain Infrastructure"
client: "DeFi Protocol"
challenge: "Building high-availability Ethereum node infrastructure serving 10M+ requests/day"
excerpt: "Deployed multi-region Ethereum node infrastructure with 99.99% uptime"
tags: ["Reth", "Lighthouse", "Docker", "Redis", "Prometheus", "Grafana"]
date: "2024-01-15"
---

## The Challenge

A rapidly growing DeFi protocol was experiencing significant reliability issues with their Ethereum node infrastructure. Their existing setup consisted of a single Geth node running on a VPS, which frequently crashed under load, causing transaction failures and unhappy users.

**Key Problems:**
- Single point of failure with one Geth node
- Frequent crashes during high network activity
- Slow sync times (2-3 weeks for full sync)
- No monitoring or alerting system
- Manual intervention required for node restarts
- Unable to scale to meet growing demand (10M+ requests/day projected)

**Requirements:**
- 99.99% uptime SLA
- Handle 10M+ RPC requests per day
- Sub-100ms response times for 95% of requests
- Automatic failover and recovery
- Comprehensive monitoring and alerting
- Cost-effective solution under $500/month

## Our Solution

We designed and deployed a multi-region, highly available Ethereum node infrastructure using modern tooling and best practices.

### Architecture Overview

**Execution Layer:**
- Primary: Reth (Rust-based, faster sync, lower resource usage)
- Backup: Geth (battle-tested fallback)
- 2x nodes per region (active-active configuration)

**Consensus Layer:**
- Lighthouse beacon nodes
- 2x nodes per region for redundancy

**Load Balancing:**
- Caddy reverse proxy with health checks
- Redis-based rate limiting
- Intelligent request routing based on node health

**Infrastructure:**
- Hetzner AX102 bare metal servers (2x)
- 2TB NVMe SSDs for fast state access
- 128GB RAM for in-memory caching
- Located in different data centers for redundancy

### Technology Stack

- **Reth**: Modern Ethereum execution client written in Rust
- **Lighthouse**: High-performance consensus client
- **Docker Compose**: Container orchestration
- **Caddy**: Reverse proxy with automatic SSL
- **Redis**: Caching and rate limiting
- **Prometheus + Grafana**: Monitoring and visualization
- **Loki**: Log aggregation
- **Alertmanager**: Alert routing to Telegram/email

## Implementation Process

### Phase 1: Infrastructure Setup (Week 1)

```bash
# Server provisioning with Terraform
terraform init
terraform apply

# Automated server configuration with Ansible
ansible-playbook -i inventory playbooks/setup-nodes.yml
```

Deployed two bare metal servers with:
- Ubuntu 22.04 LTS
- Docker + Docker Compose
- Automated security hardening
- UFW firewall with strict rules
- Automated backups to S3

### Phase 2: Node Deployment (Week 2)

```yaml
# docker-compose.yml excerpt
services:
  reth:
    image: ghcr.io/paradigmxyz/reth:latest
    command: |
      node
      --chain mainnet
      --metrics 0.0.0.0:9001
      --http
      --http.addr 0.0.0.0
      --http.api eth,net,web3
    volumes:
      - reth_data:/root/.local/share/reth
    restart: unless-stopped

  lighthouse:
    image: sigp/lighthouse:latest
    command: |
      lighthouse bn
      --network mainnet
      --execution-endpoint http://reth:8551
      --execution-jwt /jwt.hex
      --checkpoint-sync-url https://beaconstate.info
      --metrics
    volumes:
      - lighthouse_data:/root/.lighthouse
    restart: unless-stopped
```

**Key Optimizations:**
- Checkpoint sync for Lighthouse (2 hours vs 2 weeks)
- Reth full node sync in 3 days (vs 2 weeks for Geth)
- SSD optimization with proper I/O schedulers
- Memory-mapped database configuration

### Phase 3: Load Balancing & Caching (Week 3)

```caddyfile
# Caddyfile configuration
rpc.example.com {
    reverse_proxy {
        to reth-node-1:8545 reth-node-2:8545

        health_uri /health
        health_interval 10s
        health_timeout 5s

        lb_policy least_conn
    }

    rate_limit {
        zone api {
            key {remote_host}
            events 1000
            window 1m
        }
    }
}
```

**Caching Strategy:**
- Redis cache for frequently accessed data
- Block data cached for 12 seconds (1 block time)
- Historical data cached for 1 hour
- 90% cache hit rate achieved

### Phase 4: Monitoring & Alerting (Week 4)

Comprehensive monitoring setup:

**Metrics Tracked:**
- RPC request rate and latency
- Node sync status and peer count
- Disk I/O and CPU usage
- Memory consumption
- Network bandwidth
- Error rates by method

**Alerts Configured:**
- Node offline > 2 minutes
- Sync lag > 10 blocks
- Error rate > 1%
- Response time > 500ms (p95)
- Disk space < 20%

## Results

### Performance Metrics

**Before:**
- Uptime: ~92% (frequent crashes)
- P95 latency: 800ms
- Requests/day: 500K (capacity limit)
- Sync time: 2-3 weeks
- Recovery time: 2-4 hours (manual)

**After:**
- Uptime: 99.97% (SLA exceeded)
- P95 latency: 85ms (9x improvement)
- Requests/day: 12M+ (24x capacity increase)
- Sync time: 3 days (7x faster)
- Recovery time: <30 seconds (automatic)

### Cost Analysis

**Monthly Infrastructure Cost: $378**
- 2x Hetzner AX102 servers: $378/month
- Monitoring (self-hosted): $0
- Backups (S3): ~$5/month

**Cost per Million Requests: $1.05**

Compared to commercial RPC providers (Alchemy, Infura):
- Alchemy: $49/month for 3M requests → $16.33 per million
- Our solution: 15x more cost-effective
- Added benefit: Full control and no rate limits

### Business Impact

- **Zero transaction failures** due to node issues since deployment
- **User satisfaction increased** from 72% to 94%
- **Developer velocity improved** - reliable infrastructure enabled faster feature development
- **Cost savings of $120K/year** compared to commercial RPC services
- **Scalability unlocked** - infrastructure ready for 10x growth

## Technical Highlights

### Optimization Techniques

1. **Database Tuning**
   - Reth's MDBX database configured for NVMe SSDs
   - Optimal page size and cache settings
   - Regular database maintenance scripts

2. **Network Optimization**
   - Peering with major Ethereum nodes
   - BGP configuration for optimal routing
   - TCP tuning for high throughput

3. **Resource Management**
   - CPU pinning for critical processes
   - NUMA-aware memory allocation
   - I/O priority scheduling

### Disaster Recovery

- **Automated backups** of node data to S3 (daily)
- **Snapshot-based recovery** from checkpoint sync (2 hours)
- **Failover automation** with health checks (30 seconds)
- **Geographic redundancy** across 2 data centers

## Lessons Learned

1. **Reth is production-ready** - Lower resource usage and faster sync than Geth
2. **Checkpoint sync is essential** - Reduces initial sync from weeks to hours
3. **Caching is critical** - 90% cache hit rate dramatically reduces load
4. **Monitoring pays off** - Caught issues before they impacted users
5. **Bare metal > cloud** for blockchain nodes - Better performance per dollar

## Client Testimonial

> "The infrastructure Qodestack built has been rock-solid for 8 months. We went from weekly outages to zero downtime. The monitoring dashboards give us complete visibility, and the automatic failover has saved us multiple times. Best investment we made." - CTO, DeFi Protocol

## Future Enhancements

The client is now planning:
- Layer 2 node integration (Arbitrum, Optimism, Base)
- Historical data archive node
- MEV-Boost integration for additional revenue
- Multi-cloud redundancy (AWS + bare metal)

---

**Project Duration:** 4 weeks
**Technologies:** Reth, Lighthouse, Docker, Caddy, Redis, Prometheus, Grafana
**Infrastructure Cost:** $378/month
**Uptime:** 99.97%
**Requests/day:** 12M+
