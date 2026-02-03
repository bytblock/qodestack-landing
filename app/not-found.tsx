'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center section-padding pt-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10 max-w-2xl mx-auto"
        >
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="text-9xl md:text-[12rem] font-bold gradient-text-animated mb-6"
          >
            404
          </motion.h1>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Lost in the <span className="gradient-text">Blockchain</span>?
          </h2>

          <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover-scale animate-glow"
            >
              ← Back to Home
            </Link>
            <Link
              href="/#contact"
              className="glass border-2 border-accent-purple hover:bg-accent-purple hover:bg-opacity-20 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover-scale"
            >
              Get Help
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-accent-blue transition-colors">About</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-accent-blue transition-colors">Pricing</Link>
              <Link href="/portfolio" className="text-gray-400 hover:text-accent-blue transition-colors">Portfolio</Link>
              <Link href="/blog" className="text-gray-400 hover:text-accent-blue transition-colors">Blog</Link>
              <Link href="/faq" className="text-gray-400 hover:text-accent-blue transition-colors">FAQ</Link>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
