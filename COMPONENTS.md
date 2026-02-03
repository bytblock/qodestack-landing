# Component Documentation

## Hero.tsx

**Purpose**: Landing section with main value proposition

**Features**:
- Full viewport height (`min-h-screen`)
- Centered content
- Gradient text effect on "Qodestak"
- Two CTA buttons (primary & secondary)
- Smooth scroll links to sections

**Props**: None (static content)

**Styling**:
- Background: matte-black
- Text: Large responsive headings (5xl → 7xl)
- Buttons: Blue (primary), Purple outline (secondary)

---

## Services.tsx

**Purpose**: Showcase 4 core service offerings

**Features**:
- Responsive 2x2 grid (1 col mobile, 2 cols tablet+)
- Hover effects (border color change, title color)
- Icon emojis for visual appeal
- Feature lists with arrows

**Data Structure**:
```typescript
{
  title: string
  description: string
  icon: string (emoji)
  features: string[] (4 items)
}
```

**Services**:
1. Blockchain Infrastructure
2. Full-Stack Development
3. Web3 Integration
4. DevOps & Infrastructure

**Styling**:
- Background: matte-gray
- Cards: matte-light with border
- Hover: accent-blue border

---

## About.tsx

**Purpose**: Company overview and key statistics

**Features**:
- Company description (2 paragraphs)
- 3 stat cards in responsive grid
- Gradient numbers

**Stats**:
- "10+ Years Combined Experience"
- "99.9% Infrastructure Uptime"
- "24/7 Support & Monitoring"

**Props**: None (static content)

**Styling**:
- Background: matte-black
- Stat cards: matte-gray background
- Numbers: Gradient text

---

## Contact.tsx

**Purpose**: Contact form with email integration

**Features**:
- Client-side validation (React Hook Form)
- Netlify Forms serverless handling
- Honeypot spam protection
- Success/error states
- Email link in header

**Form Fields**:
- Name (required, text)
- Email (required, validated)
- Company (optional, text)
- Message (required, textarea)

**Validation**:
- Required field checks
- Email format validation
- Real-time error messages

**States**:
- `isSubmitting` - Loading state
- `submitStatus` - 'idle' | 'success' | 'error'

**Props**: None

**Netlify Integration**:
```typescript
method: 'POST'
headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
body: URLSearchParams with form-name: 'contact'
```

**Styling**:
- Background: matte-gray
- Inputs: matte-light with gray border
- Focus: accent-blue border
- Button: accent-blue with hover scale

---

## Footer.tsx

**Purpose**: Site footer with copyright and contact

**Features**:
- Copyright year (dynamic)
- Email link

**Props**: None (static content)

**Styling**:
- Background: matte-black
- Border: top border (gray-800)
- Text: gray-400
- Email: hover accent-blue

---

## Layout Structure

```
page.tsx
├── Hero
├── Services
├── About
├── Contact
└── Footer
```

## Shared Patterns

### Color Usage
- **Primary action**: accent-blue (#3b82f6)
- **Secondary action**: accent-purple (#8b5cf6)
- **Background**: matte-black (#0a0a0a)
- **Section alt**: matte-gray (#1a1a1a)
- **Cards**: matte-light (#2a2a2a)

### Spacing
- **Section padding**: `section-padding` utility class
  - Vertical: `py-20`
  - Horizontal: `px-6 md:px-12 lg:px-24`

### Typography
- **Headings**: 4xl - 7xl, font-bold
- **Body**: text-lg, text-gray-300
- **Secondary**: text-gray-400
- **Font**: Inter (Google Fonts)

### Responsive Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (≥ 768px)
- **Desktop**: `lg:` (≥ 1024px)

### Animations
- **Transitions**: `transition-all duration-300`
- **Hover scale**: `transform hover:scale-105`
- **Color transitions**: `transition-colors`

## Customization Guide

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'matte-black': '#0a0a0a',   // Main background
  'matte-gray': '#1a1a1a',    // Alt sections
  'matte-light': '#2a2a2a',   // Cards/inputs
  'accent-blue': '#3b82f6',   // Primary
  'accent-purple': '#8b5cf6', // Secondary
}
```

### Change Services
Edit `components/Services.tsx` array:
```typescript
const services = [
  {
    title: 'Your Service',
    description: 'Description',
    icon: '🎯',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
  },
  // ... add more
]
```

### Change Stats
Edit `components/About.tsx`:
```tsx
<div className="text-4xl font-bold gradient-text mb-2">10+</div>
<div className="text-gray-400">Your Stat Label</div>
```

### Change Contact Email
Replace `hello@qodestak.com` in:
- `components/Contact.tsx` (2 locations)
- `components/Footer.tsx`

### Change SEO
Edit `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your Description',
  keywords: ['your', 'keywords'],
}
```

## Component Testing Checklist

- [ ] Hero buttons scroll smoothly
- [ ] Services cards hover effect works
- [ ] Services grid responsive on mobile
- [ ] About stats display correctly
- [ ] Contact form validates required fields
- [ ] Contact form validates email format
- [ ] Contact form shows loading state
- [ ] Contact form shows success message
- [ ] Contact form shows error message
- [ ] Footer email link works
- [ ] All sections have proper spacing
- [ ] Gradient text displays correctly
- [ ] Mobile menu/layout works
