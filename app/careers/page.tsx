'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const openings = [
  {
    title: 'Senior Smart Contract Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    description: 'Build and audit production-grade smart contracts for DeFi protocols.',
    requirements: ['5+ years Solidity', 'Security mindset', 'DeFi experience']
  },
  {
    title: 'Full-Stack Blockchain Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    description: 'Create seamless Web3 experiences with React and Node.js.',
    requirements: ['React/Next.js', 'Web3.js/Ethers.js', 'Node.js']
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    type: 'Full-time',
    location: 'Remote',
    description: 'Manage blockchain infrastructure handling millions of requests.',
    requirements: ['Kubernetes', 'AWS/GCP', 'Terraform', 'Blockchain nodes']
  },
  {
    title: 'Product Manager',
    department: 'Product',
    type: 'Full-time',
    location: 'Remote',
    description: 'Drive product strategy for cutting-edge Web3 applications.',
    requirements: ['Web3 experience', 'Technical background', 'Agile']
  }
]

export default function CareersPage() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-20" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Join Our <span className="gradient-text-animated">Mission</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                Help us build the future of Web3. Work with cutting-edge technology and talented people.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-4 gap-6 mb-20"
            >
              {[
                { icon: '🌍', title: 'Remote-First', desc: 'Work from anywhere' },
                { icon: '💰', title: 'Competitive Pay', desc: 'Top-tier compensation' },
                { icon: '🚀', title: 'Latest Tech', desc: 'Cutting-edge stack' },
                { icon: '📈', title: 'Growth', desc: 'Continuous learning' }
              ].map((benefit, i) => (
                <div key={i} className="glass rounded-xl p-6 text-center hover-lift">
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Open Positions */}
            <div ref={ref}>
              <h2 className="text-3xl font-bold mb-10 text-center">Open Positions</h2>

              <div className="space-y-6 max-w-4xl mx-auto">
                {openings.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass rounded-xl p-8 hover-lift group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="text-accent-blue">{job.department}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{job.type}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{job.location}</span>
                        </div>
                      </div>
                      <Link
                        href="/#contact"
                        className="mt-4 md:mt-0 inline-block bg-accent-blue hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover-scale"
                      >
                        Apply Now
                      </Link>
                    </div>

                    <p className="text-gray-400 mb-4">{job.description}</p>

                    <div>
                      <div className="text-sm font-semibold mb-2 text-gray-300">Requirements:</div>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, i) => (
                          <span key={i} className="px-3 py-1 bg-matte-light rounded-full text-sm text-gray-300">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* No opening? */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 glass rounded-2xl p-10 text-center max-w-3xl mx-auto"
            >
              <h3 className="text-2xl font-bold mb-4">Don't see the right role?</h3>
              <p className="text-gray-400 mb-6">
                We're always looking for exceptional talent. Send us your resume and we'll reach out if there's a fit.
              </p>
              <a
                href="/#contact"
                className="inline-block glass border-2 border-accent-purple hover:bg-accent-purple hover:bg-opacity-20 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover-scale"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
