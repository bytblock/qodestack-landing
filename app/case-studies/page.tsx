import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies | Qodestack',
  description: 'Real-world projects showcasing our blockchain infrastructure, full-stack development, and Web3 integration expertise.',
}

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      slug: 'ethereum-rpc-infrastructure',
      title: 'Enterprise Ethereum RPC Infrastructure',
      category: 'Blockchain Infrastructure',
      client: 'DeFi Protocol',
      challenge: 'Building high-availability Ethereum node infrastructure serving 10M+ requests/day',
      image: '⛓️',
      tags: ['Reth', 'Lighthouse', 'Docker', 'Redis'],
      excerpt: 'Deployed multi-region Ethereum node infrastructure with 99.99% uptime'
    },
    {
      slug: 'defi-dashboard',
      title: 'Real-Time DeFi Analytics Dashboard',
      category: 'Full-Stack Development',
      client: 'Crypto Investment Fund',
      challenge: 'Building real-time portfolio tracking across 50+ DeFi protocols',
      image: '📊',
      tags: ['Next.js', 'WebSockets', 'PostgreSQL', 'Redis'],
      excerpt: 'Created dashboard tracking $100M+ in DeFi positions with sub-second updates'
    },
    {
      slug: 'nft-marketplace',
      title: 'NFT Marketplace with Lazy Minting',
      category: 'Web3 Integration',
      client: 'Digital Art Platform',
      challenge: 'Building gas-efficient NFT marketplace with creator royalties',
      image: '🎨',
      tags: ['Solidity', 'React', 'IPFS', 'The Graph'],
      excerpt: 'Launched marketplace with 10,000+ NFTs minted and $2M+ trading volume'
    },
    {
      slug: 'kubernetes-migration',
      title: 'Kubernetes Migration for SaaS Platform',
      category: 'DevOps & Infrastructure',
      client: 'B2B SaaS Company',
      challenge: 'Migrating monolithic app to Kubernetes microservices',
      image: '☸️',
      tags: ['Kubernetes', 'Terraform', 'AWS', 'GitOps'],
      excerpt: 'Reduced infrastructure costs by 40% while improving deployment velocity'
    },
    {
      slug: 'blockchain-indexer',
      title: 'Multi-Chain Blockchain Indexer',
      category: 'Blockchain Infrastructure',
      client: 'Analytics Startup',
      challenge: 'Indexing and querying data from 5+ blockchain networks',
      image: '🔍',
      tags: ['Rust', 'PostgreSQL', 'Redis', 'GraphQL'],
      excerpt: 'Built indexer processing 100K+ blocks/day across multiple chains'
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-matte-dark">
        {/* Hero Section */}
        <section className="section-padding pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Case <span className="gradient-text">Studies</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Real-world projects demonstrating our expertise in blockchain infrastructure,
                full-stack development, and Web3 integration. See how we solve complex technical challenges.
              </p>
            </div>

            {/* Case Studies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {caseStudies.map((study, index) => (
                <Link
                  key={index}
                  href={`/case-studies/${study.slug}`}
                  className="bg-matte-light rounded-xl border border-gray-800 overflow-hidden hover:border-accent-blue transition-all duration-300 group"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{study.image}</div>
                      <span className="text-sm text-accent-purple px-3 py-1 bg-matte-gray rounded-full">
                        {study.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
                      {study.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-3">Client: {study.client}</p>

                    <p className="text-gray-400 mb-4">
                      {study.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-matte-gray text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-accent-blue font-semibold flex items-center">
                      Read Case Study
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-xl p-12 text-center border border-accent-purple/30">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Let's discuss how we can bring your vision to life with our proven expertise.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-gradient-to-r from-accent-purple to-accent-blue text-white px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
