'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/#services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-matte-black/95 backdrop-blur-sm border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo-icon.svg" alt="Qodestack" className="w-8 h-8" />
            <span className="text-2xl font-bold gradient-text">Qodestack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-accent-blue ${
                  isActive(item.href) ? 'text-accent-blue' : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="bg-accent-blue hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-sm font-medium transition-colors hover:text-accent-blue ${
                  isActive(item.href) ? 'text-accent-blue' : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-accent-blue hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
