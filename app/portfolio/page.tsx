'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import Link from 'next/link'

const categories = ['All', 'DeFi', 'NFT', 'Infrastructure', 'Enterprise']

const projects = [
  {
    title: 'DeFi Trading Platform',
    category: 'DeFi',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
    description: 'High-frequency trading platform processing $50M daily volume with sub-second execution.',
    tags: ['Solidity', 'React', 'PostgreSQL'],
    metrics: { users: '10K+', volume: '$50M', uptime: '99.99%' },
    link: '#'
  },
  {
    title: 'NFT Marketplace',
    category: 'NFT',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=600&fit=crop',
    description: 'Multi-chain NFT marketplace with advanced royalty systems and gas-optimized minting.',
    tags: ['ERC-721', 'Next.js', 'IPFS'],
    metrics: { users: '25K+', nfts: '100K+', chains: '3' },
    link: '#'
  },
  {
    title: 'Ethereum Node Infrastructure',
    category: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    description: 'Enterprise-grade Ethereum node cluster handling 100M+ requests per day.',
    tags: ['Geth', 'Kubernetes', 'Prometheus'],
    metrics: { requests: '100M+', nodes: '50+', latency: '<50ms' },
    link: '#'
  },
  {
    title: 'DAO Governance Platform',
    category: 'DeFi',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    description: 'On-chain governance system with delegated voting and treasury management.',
    tags: ['Solidity', 'TypeScript', 'The Graph'],
    metrics: { members: '5K+', proposals: '200+', tvl: '$10M' },
    link: '#'
  },
  {
    title: 'Supply Chain Tracker',
    category: 'Enterprise',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
    description: 'Blockchain-based supply chain verification system for Fortune 500 company.',
    tags: ['Hyperledger', 'React', 'MongoDB'],
    metrics: { products: '1M+', partners: '100+', countries: '50+' },
    link: '#'
  },
  {
    title: 'Cross-Chain Bridge',
    category: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
    description: 'Secure cross-chain asset bridge supporting 5 major blockchain networks.',
    tags: ['Solidity', 'Go', 'Redis'],
    metrics: { volume: '$500M+', chains: '5', txs: '1M+' },
    link: '#'
  }
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <>
      <Header />
      <main className="pt-32">
        {/* Hero Section */}
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
                Our <span className="gradient-text-animated">Portfolio</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
                Explore our successful projects across DeFi, NFTs, infrastructure, and enterprise solutions.
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-accent-blue text-white scale-105'
                        : 'glass text-gray-400 hover:text-white hover-scale-sm'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Projects Grid */}
            <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass rounded-2xl overflow-hidden card-hover group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-accent-blue/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-matte-light rounded text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-gray-800">
                      {Object.entries(project.metrics).map(([key, value], i) => (
                        <div key={i} className="text-center">
                          <div className="text-sm font-bold text-accent-blue">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={project.link}
                      className="flex items-center justify-center gap-2 w-full py-2 glass rounded-lg font-semibold text-sm hover:bg-accent-blue hover:bg-opacity-20 transition-all duration-300"
                    >
                      View Case Study
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Build Something Amazing?"
          description="Let's create the next successful project together. Our team is ready to bring your vision to life."
          primaryButton={{
            text: "Start Your Project",
            href: "/#contact"
          }}
          secondaryButton={{
            text: "View Pricing",
            href: "/pricing"
          }}
        />
      </main>
      <Footer />
    </>
  )
}
