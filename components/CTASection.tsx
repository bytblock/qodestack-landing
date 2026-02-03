'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface CTASectionProps {
  title: string
  description: string
  primaryButton?: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
  className?: string
}

export default function CTASection({
  title,
  description,
  primaryButton,
  secondaryButton,
  className = ''
}: CTASectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <section ref={ref} className={`section-padding relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text-animated">
            {title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {primaryButton && (
            <Link
              href={primaryButton.href}
              className="bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover-scale animate-glow"
            >
              {primaryButton.text}
            </Link>
          )}
          {secondaryButton && (
            <Link
              href={secondaryButton.href}
              className="glass border-2 border-accent-purple hover:bg-accent-purple hover:bg-opacity-20 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover-scale"
            >
              {secondaryButton.text}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
