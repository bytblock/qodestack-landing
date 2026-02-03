---
title: "Building Production Ethereum RPC Infrastructure"
date: "2024-12-15"
excerpt: "A deep dive into architecting and deploying enterprise-grade Ethereum RPC infrastructure with high availability and sub-second response times."
tags: ["Blockchain", "Infrastructure", "Ethereum", "DevOps"]
---

Building production-grade Ethereum RPC infrastructure requires careful consideration of performance, reliability, and scalability. This guide covers the architecture and implementation of WhiteHilt Node, a high-performance RPC infrastructure serving mainnet and Layer 2 networks.

## Hardware Requirements

The foundation of any blockchain node is the underlying hardware. Virtualized environments often struggle with the I/O demands of modern execution clients like Reth.

### Storage Considerations

Reth uses MDBX for state storage, which requires exceptional I/O performance:

- **Minimum IOPS**: 500,000 random read/write operations
- **Latency**: Sub-20µs for optimal sync performance
- **Storage Type**: NVMe SSDs in RAID 0 or single high-performance drives

Virtual SCSI storage typically provides 20-40K IOPS with 100-200µs latency—13-135x slower than required. This results in 2-4 week sync times versus 7-10 days on bare metal.

### CPU and Memory

Modern execution clients are multi-threaded and benefit from high core counts:

- **CPU**: 12-16 cores minimum (Ryzen 9 7950X or similar)
- **RAM**: 48-128GB depending on configuration
- **Network**: 1Gbps+ with low latency to peers

## Software Stack

### Execution Layer: Reth

Reth is a high-performance Ethereum execution client written in Rust:

```bash
docker run -d --name reth \
  -v /data/reth:/data \
  -p 30303:30303/tcp \
  -p 30303:30303/udp \
  ghcr.io/paradigmxyz/reth:latest \
  node \
  --datadir /data \
  --http \
  --http.addr 0.0.0.0 \
  --http.api eth,net,web3 \
  --authrpc.addr 0.0.0.0 \
  --authrpc.jwtsecret /data/jwt.hex
```

Key optimizations:
- Use `--prune` flags to reduce disk usage
- Configure `--db.max-size` appropriately
- Enable `--metrics` for monitoring

### Consensus Layer: Lighthouse

Lighthouse provides beacon chain and validator client functionality:

```bash
docker run -d --name lighthouse \
  -v /data/lighthouse:/data \
  lighthouse/lighthouse:latest \
  lighthouse bn \
  --datadir /data \
  --http \
  --execution-endpoint http://reth:8551 \
  --execution-jwt /data/jwt.hex \
  --checkpoint-sync-url https://mainnet.checkpoint.sigp.io
```

Checkpoint sync reduces initial sync time from weeks to hours.

## Monitoring Stack

Production infrastructure requires comprehensive monitoring:

### Prometheus Metrics

Both Reth and Lighthouse expose Prometheus metrics:

- Sync status and block height
- Peer count and network health
- Database size and I/O metrics
- RPC request rates and latency

### Grafana Dashboards

Create dashboards for:
- Node sync progress
- System resources (CPU, RAM, disk)
- RPC performance metrics
- Alert status and incident history

### Alerting

Critical alerts with Alertmanager:
- Node offline or not syncing
- Disk space below 20%
- High error rates on RPC endpoints
- Peer count drops below threshold

## Load Balancing and Caching

### BFF API Layer

Implement a Backend-For-Frontend (BFF) API to:
- Load balance across multiple nodes
- Cache frequent queries (block numbers, gas prices)
- Rate limit clients
- Provide REST and WebSocket interfaces

### Redis Caching

Cache responses for:
- `eth_blockNumber`: 2 second TTL
- `eth_gasPrice`: 5 second TTL
- Historical blocks: 1 hour TTL
- Chain ID and network info: 24 hour TTL

## High Availability

### Redundant Nodes

Run multiple execution and consensus clients:
- Primary: Reth + Lighthouse
- Fallback: Geth + Prysm (optional)

Automatic health checks switch traffic to healthy nodes.

### Health Check Logic

```typescript
async function checkNodeHealth(url: string): Promise<boolean> {
  try {
    const blockNumber = await provider.getBlockNumber()
    const latestBlock = await getLatestBlockFromNetwork()

    // Node is healthy if within 10 blocks of latest
    return latestBlock - blockNumber < 10
  } catch {
    return false
  }
}
```

## Performance Optimization

### RPC Configuration

Optimize RPC settings for your workload:
- Limit max batch size to prevent DoS
- Set appropriate timeout values
- Configure connection limits
- Enable compression for large responses

### Network Optimization

Peer management is critical:
- Maintain 50-100 peers
- Prefer peers with low latency
- Use `--bootnodes` for fast peer discovery
- Configure `--nat` correctly for your network

## Security Considerations

### Authentication

- Use JWT tokens for execution/consensus communication
- Implement API keys for external access
- Consider mTLS for service-to-service communication

### Network Security

- Firewall rules: only expose necessary ports
- DDoS protection with rate limiting
- Regular security audits
- Keep software updated

## Cost Analysis

For WhiteHilt Node deployment:

**Hardware**: Hetzner AX102 at €189/month
- AMD Ryzen 9 7950X (16C/32T)
- 128GB DDR5 ECC RAM
- 2x 2TB NVMe in RAID 0

**Total Year 1**: ~€2,268 (~$2,500 USD)

This configuration handles mainnet + multiple Layer 2 networks with room for growth.

## Conclusion

Building production Ethereum RPC infrastructure is achievable with the right hardware, software stack, and operational practices. The key is starting with solid fundamentals: fast storage, adequate resources, and comprehensive monitoring.

Start with a single mainnet node, validate performance, then expand to Layer 2 networks as needed. With proper architecture, you can achieve 99.9% uptime and sub-second RPC response times.
