---
title: "PostgreSQL Performance Optimization: From Slow Queries to Lightning Fast"
excerpt: "A deep dive into PostgreSQL performance optimization covering indexing strategies, query optimization, connection pooling, and advanced tuning techniques that can improve your database performance by 10-100x."
date: "2024-06-20"
author: "Qodestack Team"
tags: ["postgresql", "database", "performance", "optimization", "sql"]
---

PostgreSQL is powerful, but without proper optimization, even simple queries can become bottlenecks. This comprehensive guide covers everything from basic indexing to advanced tuning techniques that have helped us achieve 10-100x performance improvements in production systems.

## Table of Contents

1. Understanding Query Performance
2. Index Strategies
3. Query Optimization
4. Connection Pooling
5. Configuration Tuning
6. Monitoring & Diagnostics
7. Scaling Strategies
8. Common Pitfalls
9. Real-World Case Studies

## 1. Understanding Query Performance

### EXPLAIN ANALYZE - Your Best Friend

```sql
-- Always use EXPLAIN ANALYZE to understand query performance
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, SETTINGS)
SELECT u.id, u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;
```

Key metrics to watch:
- **Planning Time**: Time to plan query
- **Execution Time**: Actual execution time
- **Rows**: Estimated vs actual rows
- **Buffers**: Shared hits (good), reads (bad)
- **Node Type**: Sequential Scan (bad), Index Scan (good)

### Reading Query Plans

```
Limit  (cost=1235.45..1235.47 rows=10 width=44) (actual time=12.456..12.458 rows=10 loops=1)
  ->  Sort  (cost=1235.45..1285.45 rows=20000 width=44) (actual time=12.455..12.456 rows=10 loops=1)
        Sort Key: (count(o.id)) DESC
        Sort Method: top-N heapsort  Memory: 25kB
        ->  HashAggregate  (cost=945.00..1045.00 rows=20000 width=44) (actual time=8.234..10.123 rows=15234 loops=1)
              ->  Hash Left Join  (cost=245.00..845.00 rows=20000 width=36) (actual time=1.234..6.234 rows=20000 loops=1)
                    Hash Cond: (u.id = o.user_id)
                    ->  Seq Scan on users u  (cost=0.00..450.00 rows=20000 width=32) (actual time=0.012..2.345 rows=20000 loops=1)
                          Filter: (created_at >= '2024-01-01'::date)
                    ->  Hash  (cost=145.00..145.00 rows=8000 width=8) (actual time=1.200..1.200 rows=8000 loops=1)
                          Buckets: 8192  Batches: 1  Memory Usage: 352kB
                          ->  Seq Scan on orders o  (cost=0.00..145.00 rows=8000 width=8) (actual time=0.005..0.678 rows=8000 loops=1)
```

**Red Flags:**
- Seq Scan on large tables
- High "actual time" compared to "cost"
- Large difference between estimated and actual rows
- High "Buffers reads" (disk I/O)

## 2. Index Strategies

### B-Tree Indexes (Default)

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at);

-- This query uses the index efficiently:
SELECT * FROM orders
WHERE user_id = 123
  AND status = 'pending'
  AND created_at > '2024-01-01';

-- This query only uses the first column:
SELECT * FROM orders WHERE status = 'pending';  -- Inefficient!
```

**Index Column Ordering:**
1. Equality conditions first (=)
2. Range conditions last (>, <, BETWEEN)
3. Most selective columns first

### Partial Indexes

```sql
-- Only index active users (saves space and improves performance)
CREATE INDEX idx_users_active ON users(email) WHERE active = true;

-- Only index pending orders (most common query)
CREATE INDEX idx_orders_pending ON orders(user_id, created_at)
WHERE status = 'pending';

-- Query must match the WHERE clause
SELECT * FROM orders
WHERE user_id = 123 AND status = 'pending'
ORDER BY created_at DESC;
```

### Expression Indexes

```sql
-- Index on lowercase email for case-insensitive search
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

SELECT * FROM users WHERE LOWER(email) = 'user@example.com';

-- Index on date part
CREATE INDEX idx_orders_date ON orders(DATE(created_at));

SELECT * FROM orders WHERE DATE(created_at) = '2024-01-15';

-- JSON field indexing
CREATE INDEX idx_users_metadata_role ON users((metadata->>'role'));

SELECT * FROM users WHERE metadata->>'role' = 'admin';
```

### GIN Indexes for Full-Text Search

```sql
-- Full-text search index
ALTER TABLE products ADD COLUMN search_vector tsvector;

UPDATE products SET search_vector =
  to_tsvector('english', name || ' ' || description);

CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Efficient full-text search
SELECT * FROM products
WHERE search_vector @@ to_tsquery('english', 'laptop & gaming');

-- Keep search_vector updated with trigger
CREATE FUNCTION products_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.name || ' ' || NEW.description);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_update
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION products_search_trigger();
```

### BRIN Indexes for Large Tables

```sql
-- BRIN is tiny and perfect for time-series data
CREATE INDEX idx_logs_timestamp_brin ON logs USING BRIN(timestamp);

-- 1GB table, but BRIN index is only ~100KB
SELECT * FROM logs
WHERE timestamp >= '2024-01-01'
  AND timestamp < '2024-02-01';
```

### Covering Indexes (INCLUDE)

```sql
-- Include non-key columns in index (PostgreSQL 11+)
CREATE INDEX idx_orders_user_covering ON orders(user_id)
INCLUDE (status, total, created_at);

-- Index-only scan - never touches the table!
SELECT status, total, created_at
FROM orders
WHERE user_id = 123;
```

## 3. Query Optimization

### N+1 Query Problem

```sql
-- BAD: N+1 queries (1 + N selects)
-- Application code:
users = SELECT * FROM users LIMIT 10;
for each user:
    orders = SELECT * FROM orders WHERE user_id = user.id;

-- GOOD: Single query with JOIN
SELECT u.*,
       json_agg(json_build_object(
         'id', o.id,
         'total', o.total,
         'created_at', o.created_at
       )) as orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.id = ANY($1)
GROUP BY u.id;
```

### Efficient Pagination

```sql
-- BAD: OFFSET gets slower as you go deeper
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 20 OFFSET 100000;  -- Scans and discards 100K rows!

-- GOOD: Keyset pagination (cursor-based)
SELECT * FROM products
WHERE created_at < $1  -- Last item's created_at
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Even better with composite index
CREATE INDEX idx_products_pagination ON products(created_at DESC, id DESC);
```

### Batch Operations

```sql
-- BAD: Multiple INSERT statements
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
-- ... 1000 more

-- GOOD: Single batch INSERT
INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  -- ... up to ~1000 rows per batch
ON CONFLICT (email) DO NOTHING;

-- With RETURNING for inserted IDs
INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com')
RETURNING id, name, email;
```

### Avoid SELECT *

```sql
-- BAD: Fetches unnecessary data
SELECT * FROM users WHERE id = 123;

-- GOOD: Only fetch what you need
SELECT id, name, email FROM users WHERE id = 123;

-- Even better with covering index
CREATE INDEX idx_users_id_covering ON users(id) INCLUDE (name, email);
```

### Use EXISTS Instead of COUNT

```sql
-- BAD: Counts all rows (slow)
SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
FROM orders WHERE user_id = 123;

-- GOOD: Stops at first match
SELECT EXISTS(SELECT 1 FROM orders WHERE user_id = 123);
```

### Efficient Aggregations

```sql
-- BAD: Computes aggregates on every query
SELECT
  (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_count,
  (SELECT COUNT(*) FROM orders WHERE status = 'completed') as completed_count,
  (SELECT SUM(total) FROM orders WHERE status = 'completed') as total_revenue;

-- GOOD: Single scan with FILTER
SELECT
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  SUM(total) FILTER (WHERE status = 'completed') as total_revenue
FROM orders;

-- BETTER: Materialized view for frequently accessed aggregates
CREATE MATERIALIZED VIEW order_stats AS
SELECT
  DATE(created_at) as date,
  status,
  COUNT(*) as count,
  SUM(total) as total_revenue
FROM orders
GROUP BY DATE(created_at), status;

CREATE UNIQUE INDEX ON order_stats(date, status);

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY order_stats;
```

## 4. Connection Pooling

### Why Connection Pooling Matters

PostgreSQL connection overhead:
- Fork new process: ~1-2ms
- Authentication: ~1-5ms
- Session setup: ~0.5-1ms
- **Total: 2.5-8ms per connection**

For 1000 requests/second, that's 2.5-8 seconds of pure overhead!

### PgBouncer Configuration

```ini
# /etc/pgbouncer/pgbouncer.ini
[databases]
myapp = host=localhost port=5432 dbname=myapp

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

# Pool modes:
# - session: Connection per client session
# - transaction: Connection per transaction (recommended)
# - statement: Connection per statement (aggressive)
pool_mode = transaction

# Connection limits
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3

# Server connection management
server_lifetime = 3600
server_idle_timeout = 600
server_connect_timeout = 15

# Performance tuning
server_reset_query = DISCARD ALL
server_check_delay = 30
max_db_connections = 50
```

### Application Configuration (Node.js)

```javascript
// Using pg with connection pooling
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 6432,  // PgBouncer port
  database: 'myapp',
  user: 'myapp',
  password: process.env.DB_PASSWORD,
  max: 20,  // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Always use pool, never create direct client connections
async function getUser(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

// Use transactions properly
async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();  // Always release!
  }
}
```

## 5. Configuration Tuning

### Memory Settings (postgresql.conf)

```ini
# For a server with 16GB RAM, 4 CPUs

# Shared memory for caching (25% of RAM)
shared_buffers = 4GB

# Per-connection memory for sorting/hashing
work_mem = 64MB  # Be careful: can be multiplied by concurrent queries!

# Maintenance operations (CREATE INDEX, VACUUM)
maintenance_work_mem = 1GB

# WAL settings for write performance
wal_buffers = 16MB
wal_writer_delay = 200ms

# Query planner
effective_cache_size = 12GB  # Total RAM available for caching (75% of RAM)
random_page_cost = 1.1  # SSD: 1.1, HDD: 4.0

# Checkpoint settings (balance performance vs recovery time)
checkpoint_completion_target = 0.9
checkpoint_timeout = 15min
max_wal_size = 4GB
min_wal_size = 1GB

# Connection settings
max_connections = 100  # Use PgBouncer for more
superuser_reserved_connections = 3

# Performance features
enable_partitionwise_join = on
enable_partitionwise_aggregate = on
jit = on  # Just-In-Time compilation (PostgreSQL 11+)
```

### Autovacuum Tuning

```ini
# Aggressive autovacuum for high-write workloads
autovacuum = on
autovacuum_max_workers = 4
autovacuum_naptime = 30s  # Check for work every 30s

# Trigger autovacuum earlier
autovacuum_vacuum_scale_factor = 0.1  # When 10% of rows are dead
autovacuum_analyze_scale_factor = 0.05  # When 5% changed

# More resources for autovacuum
autovacuum_work_mem = 512MB
autovacuum_vacuum_cost_delay = 10ms
autovacuum_vacuum_cost_limit = 1000

# Per-table overrides for hot tables
ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01);
ALTER TABLE orders SET (autovacuum_analyze_scale_factor = 0.005);
```

## 6. Monitoring & Diagnostics

### Essential Monitoring Queries

```sql
-- Find slow queries
SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - pg_stat_activity.query_start > interval '5 seconds'
ORDER BY duration DESC;

-- Table bloat (dead tuples)
SELECT
  schemaname,
  tablename,
  n_live_tup,
  n_dead_tup,
  round(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_percentage
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;

-- Index usage statistics
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0  -- Unused indexes
  AND indexrelname NOT LIKE '%_pkey'  -- Exclude primary keys
ORDER BY pg_relation_size(indexrelid) DESC;

-- Cache hit ratio (should be > 99%)
SELECT
  'cache hit rate' AS metric,
  sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0) AS ratio
FROM pg_statio_user_tables
UNION ALL
SELECT
  'index cache hit rate',
  sum(idx_blks_hit) / NULLIF(sum(idx_blks_hit) + sum(idx_blks_read), 0)
FROM pg_statio_user_indexes;

-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;
```

### pg_stat_statements Extension

```sql
-- Enable pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Add to postgresql.conf:
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.max = 10000
pg_stat_statements.track = all

-- Top 10 slowest queries
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time,
  rows
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Most frequently called queries
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 10;

-- Reset statistics
SELECT pg_stat_statements_reset();
```

## 7. Scaling Strategies

### Read Replicas

```sql
-- On primary server (postgresql.conf)
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
hot_standby = on

-- Create replication slot
SELECT pg_create_physical_replication_slot('replica_1');

-- On replica server
primary_conninfo = 'host=primary.example.com port=5432 user=replicator password=xxx'
primary_slot_name = 'replica_1'

-- Application-level read routing
const writePool = new Pool({ host: 'primary.db.example.com' });
const readPool = new Pool({ host: 'replica.db.example.com' });

// Write to primary
async function createUser(data) {
  return writePool.query('INSERT INTO users ... RETURNING *', [...]);
}

// Read from replica (eventual consistency okay)
async function getUsers() {
  return readPool.query('SELECT * FROM users');
}
```

### Partitioning

```sql
-- Range partitioning by date
CREATE TABLE orders (
  id BIGSERIAL,
  user_id BIGINT NOT NULL,
  total DECIMAL(10,2),
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE orders_2024_01 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02 PARTITION OF orders
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Automatic partition creation with pg_partman
CREATE EXTENSION pg_partman;

SELECT partman.create_parent(
  'public.orders',
  'created_at',
  'native',
  'monthly',
  p_premake := 3  -- Pre-create 3 months in advance
);

-- Queries automatically use correct partition
SELECT * FROM orders WHERE created_at >= '2024-01-15' AND created_at < '2024-01-20';
```

### Connection Pooling with PgBouncer

See section 4 for detailed configuration.

## 8. Common Pitfalls

### 1. Missing Indexes on Foreign Keys

```sql
-- BAD: No index on foreign key
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id)
);

-- JOIN queries are slow!
SELECT * FROM orders o JOIN users u ON o.user_id = u.id;

-- GOOD: Always index foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### 2. Using LIKE with Leading Wildcard

```sql
-- BAD: Can't use index
SELECT * FROM users WHERE email LIKE '%@example.com';

-- GOOD: Use full-text search or pg_trgm
CREATE EXTENSION pg_trgm;
CREATE INDEX idx_users_email_trgm ON users USING GIN (email gin_trgm_ops);

SELECT * FROM users WHERE email ILIKE '%@example.com%';
```

### 3. Not Using LIMIT

```sql
-- BAD: Fetches all rows
SELECT * FROM orders ORDER BY created_at DESC;

-- GOOD: Use LIMIT
SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;
```

### 4. Implicit Type Conversions

```sql
-- BAD: Index can't be used (text column, integer comparison)
SELECT * FROM users WHERE email_confirmed = 1;  -- email_confirmed is boolean!

-- GOOD: Correct type
SELECT * FROM users WHERE email_confirmed = true;
```

### 5. Not Analyzing After Bulk Operations

```sql
-- After large data changes, update statistics
INSERT INTO users SELECT * FROM temp_users;  -- 1M rows

ANALYZE users;  -- Update query planner statistics
```

## 9. Real-World Case Study

### Problem: Slow Order Dashboard

**Original query (8 seconds):**

```sql
SELECT
  o.id,
  o.total,
  u.name,
  u.email,
  (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at >= NOW() - INTERVAL '30 days'
ORDER BY o.created_at DESC;
```

**Issues identified:**
1. N+1 query for item_count (subquery executed for each row)
2. No index on orders.created_at
3. Fetching all orders (no LIMIT)

**Optimized query (45ms - 180x faster!):**

```sql
-- Add indexes
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Optimized query
SELECT
  o.id,
  o.total,
  u.name,
  u.email,
  COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.id, o.total, u.name, u.email
ORDER BY o.created_at DESC
LIMIT 50;
```

**Further optimization with materialized view:**

```sql
CREATE MATERIALIZED VIEW recent_orders_summary AS
SELECT
  o.id,
  o.total,
  o.created_at,
  u.name,
  u.email,
  COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.id, o.total, o.created_at, u.name, u.email;

CREATE INDEX ON recent_orders_summary(created_at DESC);

-- Refresh every 5 minutes
SELECT cron.schedule('refresh-orders-summary', '*/5 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY recent_orders_summary');

-- Query is now instant (< 5ms)
SELECT * FROM recent_orders_summary ORDER BY created_at DESC LIMIT 50;
```

## Conclusion

PostgreSQL performance optimization is an iterative process:

1. **Measure**: Use EXPLAIN ANALYZE to understand query performance
2. **Index**: Add appropriate indexes for your query patterns
3. **Optimize**: Rewrite queries to leverage indexes
4. **Pool**: Use connection pooling (PgBouncer)
5. **Tune**: Adjust PostgreSQL configuration for your workload
6. **Monitor**: Continuously monitor with pg_stat_statements
7. **Scale**: Add read replicas, partitioning as needed

Key takeaways:
- **Always use EXPLAIN ANALYZE** before optimizing
- **Index foreign keys** and commonly filtered columns
- **Use connection pooling** (PgBouncer or application-level)
- **Batch operations** instead of individual queries
- **Monitor pg_stat_statements** for slow queries
- **Keep statistics up to date** with ANALYZE

With these techniques, you can handle millions of queries per day on modest hardware while maintaining sub-100ms response times.

---

*Need help optimizing your PostgreSQL database? [Contact us](/contact) for a performance audit.*
