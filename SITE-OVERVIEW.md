# Qodestak Landing Page - Site Overview

## Visual Design

**Theme**: Matte black with blue (#3b82f6) and purple (#8b5cf6) accents
**Style**: Modern, minimal, professional
**Font**: Inter

## Page Sections

### 1. Hero Section
- Full viewport height
- Centered content
- Large headline: "Build the Future with **Qodestak**" (gradient text)
- Subheadline: Professional blockchain infrastructure description
- Two CTA buttons:
  - Primary: "Get Started" (blue) → scrolls to contact
  - Secondary: "Our Services" (purple outline) → scrolls to services

### 2. Services Section
Dark gray background with 4 service cards in 2x2 grid:

**Card 1: Blockchain Infrastructure** ⛓️
- Ethereum & Layer 2
- Node Operations
- RPC Infrastructure
- Monitoring & Analytics

**Card 2: Full-Stack Development** 💻
- React & Next.js
- Node.js Backend
- API Development
- Database Design

**Card 3: Web3 Integration** 🌐
- Smart Contracts
- Wallet Integration
- DApp Development
- NFT Solutions

**Card 4: DevOps & Infrastructure** 🚀
- CI/CD Pipelines
- Container Orchestration
- Cloud Infrastructure
- Monitoring & Logging

Each card has:
- Icon emoji
- Title (hover effect - turns blue)
- Description
- Feature list with purple arrows

### 3. About Section
Black background with centered content:
- Company description (2 paragraphs)
- 3 stat cards in a row:
  - "10+ Years Combined Experience"
  - "99.9% Infrastructure Uptime"
  - "24/7 Support & Monitoring"

### 4. Contact Section
Dark gray background:
- Headline with email link (b@qode.sh)
- Full-featured form:
  - Name (required)
  - Email (required, validated)
  - Company (optional)
  - Message (required)
  - Submit button
- Success/error message display
- Netlify Forms integration (serverless)
- Form submissions go to b@qode.sh

### 5. Footer
Simple black footer:
- Copyright © 2026 Qodestak
- Email link

## Color Palette

```
Backgrounds:
- matte-black: #0a0a0a (main background)
- matte-gray: #1a1a1a (section backgrounds)
- matte-light: #2a2a2a (cards, inputs)

Accents:
- accent-blue: #3b82f6 (primary CTA, links)
- accent-purple: #8b5cf6 (secondary CTA, arrows)

Text:
- Gray 100: Main text
- Gray 400: Secondary text
- White: Headers
```

## Responsive Design

- **Desktop**: Full layout with side-by-side content
- **Tablet**: Service cards stack to 2 columns
- **Mobile**: Everything stacks vertically, full width CTAs

## Interactions

- Smooth scroll between sections
- Hover effects on buttons (scale transform)
- Hover effects on service cards (border color change)
- Form validation with error messages
- Loading state on form submission
- Success/error notifications

## Performance

- Next.js 14 App Router for optimal loading
- Tailwind CSS for minimal CSS bundle
- No images (emoji icons for fast loading)
- TypeScript for type safety
- SEO optimized metadata

## Deployment

- One-click Netlify deployment
- Automatic SSL certificate
- CDN distribution
- Serverless form handling
- Custom domain ready
