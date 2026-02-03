import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Qodestack - Blockchain Infrastructure & Full-Stack Development',
  description: 'Professional blockchain infrastructure and full-stack development services. Specializing in Web3, DevOps, and custom software solutions.',
  keywords: ['blockchain', 'infrastructure', 'full-stack', 'web3', 'devops', 'development'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
