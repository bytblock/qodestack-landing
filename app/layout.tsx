import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://qodestack.com'),
  title: {
    default: 'Qodestack - Blockchain Infrastructure & Full-Stack Development',
    template: '%s | Qodestack'
  },
  description: 'Professional blockchain infrastructure and full-stack development services. Specializing in Web3, DevOps, and custom software solutions. Expert consulting for Ethereum nodes, smart contracts, and production-grade applications.',
  keywords: ['blockchain', 'infrastructure', 'full-stack', 'web3', 'devops', 'development', 'ethereum', 'smart contracts', 'kubernetes', 'postgresql', 'websockets', 'typescript', 'node.js', 'consulting'],
  authors: [{ name: 'Qodestack Team' }],
  creator: 'Qodestack',
  publisher: 'Qodestack',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://qodestack.com',
    title: 'Qodestack - Blockchain Infrastructure & Full-Stack Development',
    description: 'Professional blockchain infrastructure and full-stack development services. Specializing in Web3, DevOps, and custom software solutions.',
    siteName: 'Qodestack',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Qodestack - Blockchain Infrastructure & Full-Stack Development',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qodestack - Blockchain Infrastructure & Full-Stack Development',
    description: 'Professional blockchain infrastructure and full-stack development services.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Qodestack',
  description: 'Professional blockchain infrastructure and full-stack development services',
  url: 'https://qodestack.com',
  logo: 'https://qodestack.com/logo.svg',
  sameAs: [
    'https://github.com/qodestack',
    'https://twitter.com/qodestack',
    'https://linkedin.com/company/qodestack'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: ['English']
  },
  areaServed: 'Worldwide',
  serviceType: [
    'Blockchain Infrastructure',
    'Full-Stack Development',
    'Web3 Integration',
    'DevOps & Infrastructure'
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
