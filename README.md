# Qodestak Landing Page

A professional, dark-themed landing page for Qodestak - a development firm specializing in blockchain infrastructure and full-stack development.

## Features

- **Modern Tech Stack**: Built with Next.js 14 App Router, TypeScript, and Tailwind CSS
- **Matte Black Theme**: Professional dark theme with blue and purple accents
- **Responsive Design**: Fully responsive across all devices
- **Netlify Forms**: Integrated contact form with email notifications
- **Production Ready**: Optimized for deployment to Netlify
- **SEO Optimized**: Proper metadata and semantic HTML

## Sections

1. **Hero** - Eye-catching hero section with call-to-action buttons
2. **Services** - Four key service offerings:
   - Blockchain Infrastructure
   - Full-Stack Development
   - Web3 Integration
   - DevOps & Infrastructure
3. **About** - Company overview with key statistics
4. **Contact** - Working contact form with Netlify Forms integration
5. **Footer** - Simple footer with contact email

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd qodestak-landing
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Netlify

### Quick Deploy

1. Push your code to GitHub, GitLab, or Bitbucket

2. Log in to [Netlify](https://app.netlify.com)

3. Click "Add new site" → "Import an existing project"

4. Connect your Git provider and select your repository

5. Netlify will auto-detect Next.js. Use these settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20

6. Click "Deploy site"

### Enable Netlify Forms

After deployment, Netlify Forms should automatically work. Form submissions will:
- Go to the "Forms" tab in your Netlify dashboard
- Send email notifications to the email configured in your Netlify site settings

To configure email notifications:
1. Go to your site in Netlify dashboard
2. Navigate to "Forms" → "Form notifications"
3. Add email notification to `hello@qodestak.com`

### Environment Variables

No environment variables are required for basic functionality.

### Custom Domain

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Project Structure

```
qodestak-landing/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main page component
├── components/
│   ├── Hero.tsx              # Hero section
│   ├── Services.tsx          # Services section
│   ├── About.tsx             # About section
│   ├── Contact.tsx           # Contact form
│   └── Footer.tsx            # Footer
├── public/
│   ├── _redirects            # Netlify redirects
│   └── contact-form.html     # Static form for Netlify detection
├── netlify.toml              # Netlify configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies and scripts
```

## Customization

### Colors

Edit the color palette in `tailwind.config.ts`:

```typescript
colors: {
  'matte-black': '#0a0a0a',
  'matte-gray': '#1a1a1a',
  'matte-light': '#2a2a2a',
  'accent-blue': '#3b82f6',
  'accent-purple': '#8b5cf6',
}
```

### Content

- **Hero section**: Edit `components/Hero.tsx`
- **Services**: Modify the `services` array in `components/Services.tsx`
- **About**: Update text and stats in `components/About.tsx`
- **Contact email**: Change `hello@qodestak.com` in `components/Contact.tsx`

### Metadata

Update SEO metadata in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your Description',
  keywords: ['your', 'keywords'],
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server locally
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Deployment**: Netlify
- **Font**: Inter (Google Fonts)

## Contact Form

The contact form uses Netlify Forms for serverless form handling. Features:
- Client-side validation with React Hook Form
- Honeypot spam protection
- Success/error feedback
- Email notifications through Netlify

## Support

For issues or questions, contact hello@qodestak.com

## License

Copyright © 2026 Qodestak. All rights reserved.
