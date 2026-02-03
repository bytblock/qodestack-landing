---
title: "Next.js 14 App Router: Best Practices for Production"
date: "2025-01-10"
excerpt: "Essential patterns and techniques for building production-ready Next.js 14 applications with the App Router, Server Components, and optimal performance."
tags: ["Next.js", "React", "Web Development", "Performance"]
---

Next.js 14 with the App Router represents a paradigm shift in how we build React applications. This guide covers production-ready patterns learned from building real-world applications.

## Understanding Server vs Client Components

The App Router introduces a new mental model: Server Components by default, Client Components when needed.

### Server Components (Default)

Server Components run only on the server and never ship JavaScript to the client:

```typescript
// app/page.tsx - Server Component by default
export default async function HomePage() {
  // This runs on the server
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()

  return (
    <div>
      <h1>Server Rendered</h1>
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </div>
  )
}
```

Benefits:
- Zero JavaScript bundle size for this component
- Direct database access
- Secure API keys (never exposed to client)
- Faster initial page load

### Client Components ('use client')

Client Components enable interactivity and browser APIs:

```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

Use Client Components for:
- State management (useState, useReducer)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- React hooks (useEffect, useContext)

## Data Fetching Patterns

### Server-Side Data Fetching

Fetch data directly in Server Components:

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return <article>{post.content}</article>
}
```

This approach:
- Eliminates loading states
- Reduces client JavaScript
- Improves SEO and performance
- Simplifies error handling

### Parallel Data Fetching

Fetch multiple resources in parallel:

```typescript
export default async function DashboardPage() {
  // These fetch in parallel
  const [user, posts, stats] = await Promise.all([
    getUser(),
    getPosts(),
    getStats()
  ])

  return (
    <Dashboard user={user} posts={posts} stats={stats} />
  )
}
```

### Streaming with Suspense

Stream content as it loads:

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <AnotherSlowComponent />
      </Suspense>
    </div>
  )
}
```

The page renders immediately with loading states, then components stream in as data arrives.

## Metadata and SEO

### Static Metadata

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Qodestack - Blockchain Infrastructure',
  description: 'Enterprise-grade blockchain infrastructure',
  openGraph: {
    title: 'Qodestack',
    description: 'Blockchain Infrastructure',
    images: ['/og-image.jpg'],
  },
}
```

### Dynamic Metadata

```typescript
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: `${post.title} - Qodestack Blog`,
    description: post.excerpt,
  }
}
```

## Route Handlers (API Routes)

Create API endpoints with Route Handlers:

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const post = await createPost(body)
  return NextResponse.json(post, { status: 201 })
}
```

Route Handlers support:
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Middleware and authentication
- Streaming responses
- Edge runtime

## Static Site Generation

### generateStaticParams

Pre-render dynamic routes at build time:

```typescript
export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  return <article>{post.content}</article>
}
```

This generates static HTML for all blog posts at build time.

### Revalidation

Revalidate static pages on a schedule:

```typescript
// Revalidate every hour
export const revalidate = 3600

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{/* ... */}</div>
}
```

## Performance Optimization

### Image Optimization

Use next/image for automatic optimization:

```typescript
import Image from 'next/image'

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // Load immediately for above-fold images
    />
  )
}
```

Benefits:
- Automatic WebP/AVIF conversion
- Responsive images
- Lazy loading by default
- Blur-up placeholders

### Font Optimization

Use next/font for optimized font loading:

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

Fonts are self-hosted and optimized automatically.

### Bundle Analysis

Analyze your bundle size:

```bash
npm install -D @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})
```

Run with: `ANALYZE=true npm run build`

## Error Handling

### Error Boundaries

Create error.tsx for error handling:

```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Not Found Pages

Create not-found.tsx for 404 pages:

```typescript
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Could not find the requested resource</p>
    </div>
  )
}
```

## Testing

### Component Testing

```typescript
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders heading', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
```

### E2E Testing with Playwright

```typescript
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Qodestack')
})
```

## Deployment

### Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://...
API_KEY=secret
NEXT_PUBLIC_API_URL=https://api.example.com
```

Use `NEXT_PUBLIC_` prefix for client-accessible variables.

### Build Optimization

```javascript
// next.config.js
module.exports = {
  output: 'standalone', // Minimal Docker images
  compress: true, // Enable gzip compression
  images: {
    domains: ['example.com'],
  },
}
```

## Conclusion

The Next.js 14 App Router offers powerful primitives for building fast, SEO-friendly applications. Key takeaways:

- Default to Server Components, use Client Components strategically
- Fetch data in parallel at the Server Component level
- Use Suspense for streaming and progressive enhancement
- Optimize images and fonts with built-in tools
- Generate static pages when possible, use ISR for dynamic content

These patterns result in applications that are fast, maintainable, and deliver excellent user experiences.
