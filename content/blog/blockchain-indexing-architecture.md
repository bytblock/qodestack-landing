---
title: "Blockchain Indexing Architecture: Building Fast, Scalable Data Pipelines"
excerpt: "Learn how to build production-grade blockchain indexers that can process millions of events per day, with patterns for multi-chain support, real-time updates, and efficient querying."
date: "2024-06-30"
author: "Qodestak Team"
tags: ["blockchain", "indexing", "architecture", "rust", "postgresql"]
---

Blockchain data is append-only, immutable, and grows indefinitely. Querying it efficiently requires specialized indexing infrastructure. This guide covers battle-tested patterns for building high-performance blockchain indexers.

## Why Blockchain Indexing?

**The Problem:**
- Slow RPC queries (eth_getLogs can take 30+ seconds)
- Limited query capabilities (no JOIN, aggregation, full-text search)
- Rate limits on public RPCs
- No historical state reconstruction
- Expensive to run archive nodes ($1000+/month)

**The Solution:**
Extract blockchain data into a queryable database with:
- Sub-100ms query times
- Complex queries (JOINs, aggregations, filtering)
- Real-time updates (<5 second latency)
- Historical data readily available
- $100-500/month infrastructure cost

## Architecture Overview

```
┌──────────────┐
│ Blockchain   │
│    Node      │ ◄─── RPC calls (blocks, logs, traces)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Fetcher   │ ◄─── Parallel block fetching
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Parser    │ ◄─── Decode logs, transactions
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Database   │ ◄─── PostgreSQL + indexes
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  GraphQL API │ ◄─── Query interface
└──────────────┘
```

## Core Components

### 1. Block Fetcher

```rust
use ethers::providers::{Provider, Http, Middleware};
use std::sync::Arc;
use tokio::sync::mpsc;

pub struct BlockFetcher {
    provider: Arc<Provider<Http>>,
    concurrency: usize,
}

impl BlockFetcher {
    pub async fn fetch_range(
        &self,
        start: u64,
        end: u64,
    ) -> Result<Vec<Block>> {
        let (tx, mut rx) = mpsc::channel(self.concurrency * 2);
        let semaphore = Arc::new(Semaphore::new(self.concurrency));

        // Spawn tasks for each block
        let mut handles = vec![];
        for block_num in start..=end {
            let tx = tx.clone();
            let provider = Arc::clone(&self.provider);
            let permit = Arc::clone(&semaphore);

            let handle = tokio::spawn(async move {
                let _permit = permit.acquire().await.unwrap();

                match provider.get_block_with_txs(block_num).await {
                    Ok(Some(block)) => {
                        let _ = tx.send(Ok(block)).await;
                    }
                    Ok(None) => {
                        let _ = tx.send(Err(anyhow::anyhow!("Block {} not found", block_num))).await;
                    }
                    Err(e) => {
                        let _ = tx.send(Err(e.into())).await;
                    }
                }
            });

            handles.push(handle);
        }

        drop(tx);

        // Collect results
        let mut blocks = vec![];
        while let Some(result) = rx.recv().await {
            blocks.push(result?);
        }

        // Sort by block number
        blocks.sort_by_key(|b| b.number.unwrap().as_u64());

        Ok(blocks)
    }

    pub async fn stream_new_blocks(
        &self,
    ) -> impl Stream<Item = Block> {
        let provider = Arc::clone(&self.provider);
        let mut current = provider.get_block_number().await.unwrap().as_u64();

        async_stream::stream! {
            loop {
                match provider.get_block_with_txs(current).await {
                    Ok(Some(block)) => {
                        yield block;
                        current += 1;
                    }
                    Ok(None) => {
                        // Block not available yet
                        tokio::time::sleep(Duration::from_secs(2)).await;
                    }
                    Err(e) => {
                        eprintln!("Error fetching block {}: {}", current, e);
                        tokio::time::sleep(Duration::from_secs(5)).await;
                    }
                }
            }
        }
    }
}
```

### 2. Event Parser

```rust
use ethers::abi::{Abi, Event, RawLog};
use std::collections::HashMap;

pub struct EventParser {
    // Cache of contract ABIs
    abis: HashMap<Address, Abi>,
    // Map event signatures to definitions
    events: HashMap<H256, Event>,
}

impl EventParser {
    pub fn new() -> Self {
        let mut parser = Self {
            abis: HashMap::new(),
            events: HashMap::new(),
        };

        // Load standard ABIs
        parser.load_erc20_abi();
        parser.load_erc721_abi();
        parser.load_erc1155_abi();
        parser.load_uniswap_abi();

        parser
    }

    fn load_erc20_abi(&mut self) {
        let abi: Abi = serde_json::from_str(include_str!("../abis/erc20.json")).unwrap();

        for event in abi.events() {
            self.events.insert(event.signature(), event.clone());
        }
    }

    pub fn parse_log(&self, log: &Log) -> Result<ParsedEvent> {
        let signature = log.topics.get(0)
            .ok_or_else(|| anyhow::anyhow!("No topics"))?;

        let event = self.events.get(signature)
            .ok_or_else(|| anyhow::anyhow!("Unknown event: {}", signature))?;

        let raw_log = RawLog {
            topics: log.topics.clone(),
            data: log.data.to_vec(),
        };

        let decoded = event.parse_log(raw_log)?;

        Ok(ParsedEvent {
            name: event.name.clone(),
            signature: event.signature(),
            params: decoded.params,
            address: log.address,
            block_number: log.block_number.unwrap().as_u64(),
            transaction_hash: log.transaction_hash.unwrap(),
            log_index: log.log_index.unwrap().as_u64(),
        })
    }

    pub fn parse_logs(&self, logs: &[Log]) -> Vec<ParsedEvent> {
        logs.par_iter()  // Parallel processing
            .filter_map(|log| self.parse_log(log).ok())
            .collect()
    }
}
```

### 3. Database Schema

```sql
-- Blocks table (partitioned by chain)
CREATE TABLE blocks (
    chain_id INTEGER NOT NULL,
    block_number BIGINT NOT NULL,
    block_hash BYTEA NOT NULL,
    parent_hash BYTEA,
    timestamp TIMESTAMPTZ NOT NULL,
    gas_used BIGINT,
    gas_limit BIGINT,
    PRIMARY KEY (chain_id, block_number)
) PARTITION BY LIST (chain_id);

CREATE TABLE blocks_ethereum PARTITION OF blocks FOR VALUES IN (1);
CREATE TABLE blocks_polygon PARTITION OF blocks FOR VALUES IN (137);

-- Transactions
CREATE TABLE transactions (
    chain_id INTEGER NOT NULL,
    block_number BIGINT NOT NULL,
    transaction_hash BYTEA NOT NULL,
    transaction_index INTEGER NOT NULL,
    from_address BYTEA NOT NULL,
    to_address BYTEA,
    value NUMERIC(78, 0),
    gas_price BIGINT,
    gas_used BIGINT,
    input_data BYTEA,
    status BOOLEAN,
    PRIMARY KEY (chain_id, transaction_hash)
);

CREATE INDEX idx_transactions_from ON transactions (from_address, block_number DESC);
CREATE INDEX idx_transactions_to ON transactions (to_address, block_number DESC);
CREATE INDEX idx_transactions_block ON transactions (chain_id, block_number);

-- ERC-20 Transfers (specialized table for performance)
CREATE TABLE erc20_transfers (
    chain_id INTEGER NOT NULL,
    block_number BIGINT NOT NULL,
    transaction_hash BYTEA NOT NULL,
    log_index INTEGER NOT NULL,
    token_address BYTEA NOT NULL,
    from_address BYTEA NOT NULL,
    to_address BYTEA NOT NULL,
    amount NUMERIC(78, 0) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (chain_id, block_number, log_index)
) PARTITION BY RANGE (timestamp);

-- Monthly partitions
CREATE TABLE erc20_transfers_2024_01 PARTITION OF erc20_transfers
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE INDEX idx_erc20_from ON erc20_transfers (from_address, block_number DESC);
CREATE INDEX idx_erc20_to ON erc20_transfers (to_address, block_number DESC);
CREATE INDEX idx_erc20_token ON erc20_transfers (token_address, block_number DESC);

-- Materialized views for aggregates
CREATE MATERIALIZED VIEW token_daily_stats AS
SELECT
    chain_id,
    token_address,
    DATE(timestamp) as date,
    COUNT(DISTINCT from_address) as unique_senders,
    COUNT(DISTINCT to_address) as unique_receivers,
    COUNT(*) as transfer_count,
    SUM(amount) as total_volume
FROM erc20_transfers
GROUP BY chain_id, token_address, DATE(timestamp);

CREATE UNIQUE INDEX ON token_daily_stats (chain_id, token_address, date);

-- Auto-refresh every hour
SELECT cron.schedule(
    'refresh-token-stats',
    '0 * * * *',
    'REFRESH MATERIALIZED VIEW CONCURRENTLY token_daily_stats'
);
```

### 4. Checkpoint System

```rust
use sqlx::PgPool;

pub struct CheckpointManager {
    db: PgPool,
    chain_id: u64,
}

impl CheckpointManager {
    pub async fn get_last_indexed_block(&self) -> Result<u64> {
        let row: Option<(i64,)> = sqlx::query_as(
            "SELECT MAX(block_number) FROM blocks WHERE chain_id = $1"
        )
        .bind(self.chain_id as i32)
        .fetch_optional(&self.db)
        .await?;

        Ok(row.map(|(n,)| n as u64).unwrap_or(0))
    }

    pub async fn save_checkpoint(&self, block_number: u64) -> Result<()> {
        sqlx::query(
            "INSERT INTO indexer_checkpoints (chain_id, block_number, updated_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (chain_id) DO UPDATE SET
                block_number = EXCLUDED.block_number,
                updated_at = NOW()"
        )
        .bind(self.chain_id as i32)
        .bind(block_number as i64)
        .execute(&self.db)
        .await?;

        Ok(())
    }

    pub async fn with_transaction<F, R>(&self, f: F) -> Result<R>
    where
        F: FnOnce(&mut sqlx::Transaction<sqlx::Postgres>) -> Result<R>,
    {
        let mut tx = self.db.begin().await?;
        let result = f(&mut tx)?;
        tx.commit().await?;
        Ok(result)
    }
}
```

### 5. Main Indexer Loop

```rust
pub struct Indexer {
    fetcher: BlockFetcher,
    parser: EventParser,
    db: Database,
    checkpoint: CheckpointManager,
}

impl Indexer {
    pub async fn index_historical(&self, start: u64, end: u64) -> Result<()> {
        const BATCH_SIZE: u64 = 100;

        for batch_start in (start..=end).step_by(BATCH_SIZE as usize) {
            let batch_end = (batch_start + BATCH_SIZE - 1).min(end);

            println!("Indexing blocks {} to {}", batch_start, batch_end);

            // Fetch blocks
            let blocks = self.fetcher.fetch_range(batch_start, batch_end).await?;

            // Parse logs
            let all_logs: Vec<Log> = blocks.iter()
                .flat_map(|block| block.transactions.iter())
                .flat_map(|tx| tx.logs.iter())
                .cloned()
                .collect();

            let events = self.parser.parse_logs(&all_logs);

            // Insert to database
            self.checkpoint.with_transaction(|tx| {
                self.db.insert_blocks(tx, &blocks)?;
                self.db.insert_transactions(tx, &blocks)?;
                self.db.insert_events(tx, &events)?;
                Ok(())
            }).await?;

            // Save checkpoint
            self.checkpoint.save_checkpoint(batch_end).await?;

            println!("✓ Indexed {} blocks, {} events", blocks.len(), events.len());
        }

        Ok(())
    }

    pub async fn index_realtime(&self) -> Result<()> {
        let start_block = self.checkpoint.get_last_indexed_block().await? + 1;
        let mut stream = self.fetcher.stream_new_blocks().await;

        while let Some(block) = stream.next().await {
            // Parse block
            let logs: Vec<Log> = block.transactions.iter()
                .flat_map(|tx| tx.logs.iter())
                .cloned()
                .collect();

            let events = self.parser.parse_logs(&logs);

            // Insert to database
            self.checkpoint.with_transaction(|tx| {
                self.db.insert_block(tx, &block)?;
                self.db.insert_transactions(tx, &[block])?;
                self.db.insert_events(tx, &events)?;
                Ok(())
            }).await?;

            // Save checkpoint
            let block_num = block.number.unwrap().as_u64();
            self.checkpoint.save_checkpoint(block_num).await?;

            println!("✓ Indexed block {} with {} events", block_num, events.len());
        }

        Ok(())
    }
}
```

## Performance Optimizations

### 1. Batch Inserts

```rust
pub async fn insert_events_batch(
    &self,
    tx: &mut Transaction<'_, Postgres>,
    events: &[ParsedEvent],
) -> Result<()> {
    // Group by event type for efficient insertion
    let erc20_transfers: Vec<_> = events.iter()
        .filter(|e| e.name == "Transfer" && is_erc20(e))
        .collect();

    let erc721_transfers: Vec<_> = events.iter()
        .filter(|e| e.name == "Transfer" && is_erc721(e))
        .collect();

    // Batch insert each type
    if !erc20_transfers.is_empty() {
        self.insert_erc20_transfers(tx, &erc20_transfers).await?;
    }

    if !erc721_transfers.is_empty() {
        self.insert_erc721_transfers(tx, &erc721_transfers).await?;
    }

    Ok(())
}

async fn insert_erc20_transfers(
    &self,
    tx: &mut Transaction<'_, Postgres>,
    transfers: &[&ParsedEvent],
) -> Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new(
        "INSERT INTO erc20_transfers (chain_id, block_number, transaction_hash, log_index, token_address, from_address, to_address, amount, timestamp)"
    );

    query_builder.push_values(transfers.chunks(1000), |mut b, chunk| {
        for transfer in chunk {
            b.push_bind(self.chain_id)
                .push_bind(transfer.block_number as i64)
                .push_bind(transfer.transaction_hash.as_bytes())
                .push_bind(transfer.log_index as i32)
                .push_bind(transfer.address.as_bytes())
                .push_bind(get_param(transfer, "from"))
                .push_bind(get_param(transfer, "to"))
                .push_bind(get_param(transfer, "value"))
                .push_bind(transfer.timestamp);
        }
    });

    query_builder.push(" ON CONFLICT DO NOTHING");

    query_builder.build().execute(&mut **tx).await?;
    Ok(())
}
```

### 2. Connection Pooling

```rust
let pool = PgPoolOptions::new()
    .max_connections(10)
    .min_connections(2)
    .acquire_timeout(Duration::from_secs(30))
    .idle_timeout(Duration::from_secs(600))
    .connect(&database_url)
    .await?;
```

### 3. Parallel Processing

```rust
use rayon::prelude::*;

// Parse logs in parallel
let events: Vec<ParsedEvent> = logs.par_iter()
    .filter_map(|log| parser.parse_log(log).ok())
    .collect();
```

## Multi-Chain Support

```rust
pub struct MultiChainIndexer {
    indexers: HashMap<u64, Indexer>,
}

impl MultiChainIndexer {
    pub async fn index_all_chains(&self) -> Result<()> {
        let handles: Vec<_> = self.indexers.iter()
            .map(|(chain_id, indexer)| {
                let indexer = indexer.clone();
                tokio::spawn(async move {
                    println!("Starting indexer for chain {}", chain_id);
                    indexer.index_realtime().await
                })
            })
            .collect();

        // Wait for all indexers
        for handle in handles {
            handle.await??;
        }

        Ok(())
    }
}
```

## GraphQL API

```rust
use async_graphql::*;

#[derive(SimpleObject)]
struct ERC20Transfer {
    chain_id: i32,
    block_number: i64,
    transaction_hash: String,
    token_address: String,
    from_address: String,
    to_address: String,
    amount: String,
    timestamp: String,
}

struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn erc20_transfers(
        &self,
        ctx: &Context<'_>,
        chain_id: i32,
        address: String,
        #[graphql(default = 100)] limit: i32,
    ) -> Result<Vec<ERC20Transfer>> {
        let db = ctx.data::<Database>()?;

        let transfers = sqlx::query_as!(
            ERC20Transfer,
            r#"
            SELECT
                chain_id,
                block_number,
                encode(transaction_hash, 'hex') as transaction_hash,
                encode(token_address, 'hex') as token_address,
                encode(from_address, 'hex') as from_address,
                encode(to_address, 'hex') as to_address,
                amount::text as amount,
                timestamp::text as timestamp
            FROM erc20_transfers
            WHERE chain_id = $1
              AND (from_address = decode($2, 'hex') OR to_address = decode($2, 'hex'))
            ORDER BY block_number DESC
            LIMIT $3
            "#,
            chain_id,
            address.trim_start_matches("0x"),
            limit
        )
        .fetch_all(&db.pool)
        .await?;

        Ok(transfers)
    }

    async fn token_stats(
        &self,
        ctx: &Context<'_>,
        chain_id: i32,
        token_address: String,
    ) -> Result<TokenStats> {
        let db = ctx.data::<Database>()?;

        let stats = sqlx::query_as!(
            TokenStats,
            r#"
            SELECT
                unique_senders,
                unique_receivers,
                transfer_count,
                total_volume::text
            FROM token_daily_stats
            WHERE chain_id = $1
              AND token_address = decode($2, 'hex')
            ORDER BY date DESC
            LIMIT 1
            "#,
            chain_id,
            token_address.trim_start_matches("0x")
        )
        .fetch_one(&db.pool)
        .await?;

        Ok(stats)
    }
}
```

## Monitoring

```rust
use prometheus::{Counter, Histogram, IntGauge};

lazy_static! {
    static ref BLOCKS_INDEXED: Counter = Counter::new(
        "blocks_indexed_total",
        "Total number of blocks indexed"
    ).unwrap();

    static ref EVENTS_PROCESSED: Counter = Counter::new(
        "events_processed_total",
        "Total number of events processed"
    ).unwrap();

    static ref INDEXING_LATENCY: Histogram = Histogram::new(
        "indexing_latency_seconds",
        "Time to index a block"
    ).unwrap();

    static ref CURRENT_BLOCK: IntGauge = IntGauge::new(
        "current_indexed_block",
        "Current indexed block number"
    ).unwrap();
}

// In indexer loop
let timer = INDEXING_LATENCY.start_timer();
// ... index block
timer.observe_duration();
BLOCKS_INDEXED.inc();
EVENTS_PROCESSED.inc_by(events.len() as f64);
CURRENT_BLOCK.set(block_number as i64);
```

## Conclusion

Building a production blockchain indexer requires:

1. **Efficient data fetching**: Parallel RPC calls, batching
2. **Smart parsing**: Event signature caching, parallel processing
3. **Optimized database**: Partitioning, strategic indexes, batch inserts
4. **Checkpoint system**: Resume from failures without data loss
5. **Real-time updates**: Stream new blocks with <5 second latency
6. **Monitoring**: Track performance, catch issues early
7. **Scalability**: Multi-chain support, horizontal scaling

With these patterns, you can build indexers processing 100K+ blocks/day while maintaining sub-100ms query times.

---

*Building a blockchain indexer? [Contact us](/contact) for architecture consulting.*
