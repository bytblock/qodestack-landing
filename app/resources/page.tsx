'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'

const resources = [
  {
    category: 'Guides',
    items: [
      {
        title: 'Smart Contract Security Best Practices',
        description: 'Complete guide to writing secure Solidity contracts',
        type: 'PDF',
        size: '2.5 MB',
        downloads: '1.2K'
      },
      {
        title: 'Web3 Integration Handbook',
        description: 'Step-by-step integration guide for Web3.js and Ethers.js',
        type: 'PDF',
        size: '1.8 MB',
        downloads: '890'
      },
      {
        title: 'Gas Optimization Techniques',
        description: 'Advanced strategies to reduce smart contract gas costs',
        type: 'PDF',
        size: '1.2 MB',
        downloads: '2.1K'
      }
    ]
  },
  {
    category: 'Whitepapers',
    items: [
      {
        title: 'Scaling Ethereum Infrastructure',
        description: 'Architecture patterns for high-throughput blockchain systems',
        type: 'PDF',
        size: '3.2 MB',
        downloads: '567'
      },
      {
        title: 'DeFi Protocol Design',
        description: 'Building secure and efficient DeFi applications',
        type: 'PDF',
        size: '2.8 MB',
        downloads: '743'
      }
    ]
  },
  {
    category: 'Tools',
    items: [
      {
        title: 'Smart Contract Template Library',
        description: 'Production-ready Solidity templates for common patterns',
        type: 'GitHub',
        size: 'Open Source',
        downloads: '3.4K'
      },
      {
        title: 'Gas Calculator Tool',
        description: 'Estimate transaction costs across different chains',
        type: 'Web App',
        size: 'Free',
        downloads: '5.2K'
      }
    ]
  }
]

export default function ResourcesPage() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Free <span className="gradient-text-animated">Resources</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                Guides, whitepapers, and tools to help you build better blockchain applications.
              </p>
            </motion.div>

            <div ref={ref} className="space-y-16">
              {resources.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                >
                  <h2 className="text-3xl font-bold mb-8 gradient-text">{section.category}</h2>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.items.map((resource, index) => (
                      <div
                        key={index}
                        className="glass rounded-xl p-6 hover-lift group cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-4xl">
                            {resource.type === 'PDF' && '📄'}
                            {resource.type === 'GitHub' && '💻'}
                            {resource.type === 'Web App' && '🌐'}
                          </div>
                          <button className="glass px-4 py-2 rounded-lg font-semibold text-sm hover:bg-accent-blue hover:bg-opacity-20 transition-all">
                            Download
                          </button>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {resource.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
                            </svg>
                            {resource.downloads} downloads
                          </span>
                          <span>{resource.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-20 glass rounded-2xl p-10 text-center max-w-3xl mx-auto"
            >
              <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-8">
                Get the latest guides, tools, and insights delivered to your inbox monthly.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-4 bg-matte-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
                <button
                  type="submit"
                  className="bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover-scale"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        <CTASection
          title="Need Custom Solutions?"
          description="Our team can build tailored tools and infrastructure specifically for your project needs."
          primaryButton={{
            text: "Get in Touch",
            href: "/#contact"
          }}
          secondaryButton={{
            text: "View Services",
            href: "/#services"
          }}
        />
      </main>
      <Footer />
    </>
  )
}
