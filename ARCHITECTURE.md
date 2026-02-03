# Architecture Overview

## Application Flow

```
User visits site
     ↓
app/layout.tsx (Root Layout)
├── Metadata (SEO)
├── Inter font
└── app/globals.css (Tailwind)
     ↓
app/page.tsx (Main Page)
├── Hero
├── Services
├── About
├── Contact
└── Footer
```

## Component Hierarchy

```
RootLayout
└── Home (page.tsx)
    ├── Hero
    │   ├── Heading with gradient
    │   ├── Subheading
    │   └── CTA buttons
    │       ├── "Get Started" → #contact
    │       └── "Our Services" → #services
    │
    ├── Services (id="services")
    │   ├── Section header
    │   └── Service cards (grid)
    │       ├── Blockchain Infrastructure
    │       ├── Full-Stack Development
    │       ├── Web3 Integration
    │       └── DevOps & Infrastructure
    │
    ├── About (id="about")
    │   ├── Company description
    │   └── Stats grid
    │       ├── Years Experience
    │       ├── Uptime %
    │       └── Support 24/7
    │
    ├── Contact (id="contact")
    │   ├── Form (Netlify)
    │   │   ├── Name (required)
    │   │   ├── Email (required)
    │   │   ├── Company (optional)
    │   │   └── Message (required)
    │   └── Submit handler
    │
    └── Footer
        ├── Copyright
        └── Email link
```

## Data Flow

### Contact Form Submission

```
User fills form
     ↓
React Hook Form validation
     ↓
onSubmit handler
     ↓
POST to "/" with form-name="contact"
     ↓
Netlify Forms processes
     ↓
Email sent to hello@qodestack.com
     ↓
Success/Error feedback to user
```

### Navigation Flow

```
User clicks CTA
     ↓
href="#section-id"
     ↓
Smooth scroll (CSS: scroll-behavior: smooth)
     ↓
Section comes into view
```

## State Management

### Contact Component State

```typescript
isSubmitting: boolean
  - false: Form ready
  - true: Submitting (button disabled)

submitStatus: 'idle' | 'success' | 'error'
  - idle: Initial/default state
  - success: Form submitted successfully
  - error: Submission failed

formState: { errors }
  - From React Hook Form
  - Tracks validation errors per field
```

## Styling Architecture

### Tailwind Utility Classes

```
Layout:
- section-padding → py-20 px-6 md:px-12 lg:px-24

Typography:
- gradient-text → bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent

Responsive:
- Mobile-first approach
- md: tablet (768px+)
- lg: desktop (1024px+)
```

### Color System

```
Theme Colors (tailwind.config.ts):
- matte-black (#0a0a0a)   → Main background
- matte-gray (#1a1a1a)    → Alternating sections
- matte-light (#2a2a2a)   → Cards, inputs
- accent-blue (#3b82f6)   → Primary actions
- accent-purple (#8b5cf6) → Secondary accents

Semantic Usage:
- Background: matte-black
- Section Alt: matte-gray
- Cards: matte-light + border-gray-800
- Primary CTA: accent-blue
- Secondary CTA: border-accent-purple
- Hover: border-accent-blue
```

## Build Process

```
Development:
npm run dev
     ↓
Next.js dev server (port 3000)
     ↓
Hot reload enabled
     ↓
Tailwind JIT compilation

Production:
npm run build
     ↓
TypeScript compilation
     ↓
Next.js optimization
     ↓
Static generation
     ↓
.next/ output directory
     ↓
Netlify deployment
```

## Deployment Architecture

```
Git Repository
     ↓
Netlify Build System
     ↓
npm install
     ↓
npm run build
     ↓
Deploy to CDN
     ↓
HTTPS (auto SSL)
     ↓
Live Site

Form Submissions:
User submits form
     ↓
Netlify Forms API
     ↓
Stores in dashboard
     ↓
Email notification
     ↓
hello@qodestack.com
```

## File Dependencies

```
app/page.tsx
├── requires: components/Hero
├── requires: components/Services
├── requires: components/About
├── requires: components/Contact
└── requires: components/Footer

app/layout.tsx
├── requires: app/globals.css
└── requires: next/font/google (Inter)

components/Contact.tsx
├── requires: react-hook-form
├── requires: react (useState)
└── integrates: Netlify Forms

tailwind.config.ts
└── configures: app/globals.css

netlify.toml
├── configures: Build command
├── configures: Publish directory
└── configures: Redirects
```

## Performance Optimizations

1. **No images** - Emoji icons for fast loading
2. **Tailwind JIT** - Only used classes in CSS
3. **Next.js optimization** - Automatic code splitting
4. **Font optimization** - next/font/google
5. **Static generation** - Pre-rendered at build
6. **CDN delivery** - Netlify global CDN

## Security Features

1. **HTTPS** - Auto SSL certificate
2. **Honeypot** - Spam protection (bot-field)
3. **CORS** - Same-origin form submission
4. **Validation** - Client-side input validation
5. **No secrets** - No API keys exposed

## Scalability Considerations

- **Serverless forms** - No backend to maintain
- **Static site** - Scales infinitely on CDN
- **No database** - Form data in Netlify dashboard
- **No authentication** - Public site, no auth needed

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Smooth scroll fallback for older browsers
- CSS Grid/Flexbox (supported everywhere)

## Accessibility

- Semantic HTML (section, nav, form)
- Form labels with htmlFor
- ARIA-compliant form validation
- Keyboard navigation support
- Focus states on interactive elements
