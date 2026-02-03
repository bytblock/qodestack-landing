---
title: "Building Scalable REST APIs with Node.js and PostgreSQL"
date: "2024-10-22"
excerpt: "Production-ready patterns for building high-performance REST APIs that scale from prototype to millions of requests per day."
tags: ["Backend", "Node.js", "PostgreSQL", "API Design"]
---

Building APIs is straightforward. Building APIs that scale, perform well, and remain maintainable is an art. This guide covers battle-tested patterns for production Node.js + PostgreSQL APIs.

## Architecture Overview

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│   Nginx  │────▶│ Node.js  │────▶│PostgreSQL│
└──────────┘     └──────────┘     │    API   │     └──────────┘
                                   └────┬─────┘
                                        │
                                        ▼
                                   ┌──────────┐
                                   │  Redis   │
                                   └──────────┘
```

## Project Structure

```
api/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── redis.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── users.ts
│   │   └── posts.ts
│   ├── services/
│   │   ├── userService.ts
│   │   └── postService.ts
│   ├── models/
│   │   └── index.ts
│   ├── utils/
│   │   └── logger.ts
│   └── app.ts
├── tests/
├── migrations/
└── package.json
```

## Database Setup

### Connection Pooling

```typescript
// src/config/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Health check
pool.on('error', (err) => {
  console.error('Unexpected database error', err);
  process.exit(-1);
});

export default pool;
```

### Query Builder

```typescript
// src/models/User.ts
import pool from '../config/database';

interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export class UserModel {
  static async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(email: string, name: string): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, name)
       VALUES ($1, $2)
       RETURNING id, email, name, created_at`,
      [email, name]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }
}
```

## Performance Optimizations

### 1. Database Indexing

```sql
-- Create indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Composite index for common WHERE clauses
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Partial index for active records
CREATE INDEX idx_active_posts ON posts(user_id) WHERE deleted_at IS NULL;
```

### 2. Query Optimization

```typescript
// BAD: N+1 Query Problem
async function getPostsWithAuthors() {
  const posts = await pool.query('SELECT * FROM posts');

  for (const post of posts.rows) {
    // This runs a query for EACH post!
    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [post.user_id]
    );
    post.author = user.rows[0];
  }

  return posts.rows;
}

// GOOD: JOIN to fetch everything in one query
async function getPostsWithAuthors() {
  const result = await pool.query(`
    SELECT
      posts.*,
      users.name as author_name,
      users.email as author_email
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
    LIMIT 100
  `);

  return result.rows;
}
```

### 3. Caching with Redis

```typescript
// src/config/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export default redis;

// src/services/userService.ts
import redis from '../config/redis';
import { UserModel } from '../models/User';

export class UserService {
  static async getUser(id: number) {
    const cacheKey = `user:${id}`;

    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Cache miss - query database
    const user = await UserModel.findById(id);

    if (user) {
      // Cache for 5 minutes
      await redis.setex(cacheKey, 300, JSON.stringify(user));
    }

    return user;
  }

  static async updateUser(id: number, data: any) {
    const user = await UserModel.update(id, data);

    // Invalidate cache
    await redis.del(`user:${id}`);

    return user;
  }
}
```

## API Design Patterns

### 1. Pagination

```typescript
interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getPaginatedPosts(
  params: PaginationParams
): Promise<PaginatedResponse<Post>> {
  const { page = 1, limit = 20 } = params;
  const offset = (page - 1) * limit;

  // Get total count
  const countResult = await pool.query('SELECT COUNT(*) FROM posts');
  const total = parseInt(countResult.rows[0].count);

  // Get paginated data
  const result = await pool.query(
    `SELECT * FROM posts
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### 2. Input Validation

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().min(18).max(120).optional(),
});

app.post('/users', async (req, res) => {
  try {
    const data = CreateUserSchema.parse(req.body);
    const user = await UserService.create(data);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    throw error;
  }
});
```

### 3. Error Handling

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

// Usage
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await UserService.getUser(parseInt(req.params.id));

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

## Security

### 1. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from './config/redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate_limit:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);
```

### 2. Authentication

```typescript
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route
app.get('/api/profile', authMiddleware, async (req, res) => {
  const user = await UserService.getUser(req.user.id);
  res.json(user);
});
```

## Monitoring and Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log all requests
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
    });
  });

  next();
});
```

## Load Testing

```bash
# Install k6
brew install k6

# test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100, // Virtual users
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/posts');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}

# Run test
k6 run test.js
```

## Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Conclusion

Building scalable APIs requires:
- Efficient database queries with proper indexing
- Strategic caching to reduce database load
- Input validation and error handling
- Rate limiting and authentication
- Comprehensive monitoring

Start simple, measure performance, optimize bottlenecks.

---

*Need help building scalable backend infrastructure? [Contact Qodestack](/contact) for a consultation.*
