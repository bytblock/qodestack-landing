'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'

const processSteps = [
  {
    number: '01',
    title: 'Discovery & Planning',
    description: 'We start by understanding your vision, technical requirements, and business goals. Deep dive into your use case.',
    duration: '1-2 weeks',
    deliverables: ['Technical specification', 'Architecture design', 'Project timeline', 'Cost estimate'],
    icon: '🔍'
  },
  {
    number: '02',
    title: 'Smart Contract Development',
    description: 'Our engineers build your smart contracts with security and gas optimization as top priorities.',
    duration: '2-4 weeks',
    deliverables: ['Smart contracts', 'Unit tests', 'Security audit report', 'Testnet deployment'],
    icon: '⚙️'
  },
  {
    number: '03',
    title: 'Full-Stack Integration',
    description: 'Create beautiful, responsive interfaces that seamlessly interact with your blockchain infrastructure.',
    duration: '3-6 weeks',
    deliverables: ['Frontend application', 'Backend API', 'Admin dashboard', 'Documentation'],
    icon: '🎨'
  },
  {
    number: '04',
    title: 'Testing & Security',
    description: 'Comprehensive testing across all layers. Multiple security audits before mainnet deployment.',
    duration: '1-2 weeks',
    deliverables: ['Test reports', 'Security audit', 'Performance benchmarks', 'Bug fixes'],
    icon: '🛡️'
  },
  {
    number: '05',
    title: 'Deployment & Launch',
    description: 'Smooth mainnet deployment with monitoring, alerting, and disaster recovery systems in place.',
    duration: '1 week',
    deliverables: ['Mainnet deployment', 'Monitoring setup', 'CI/CD pipeline', 'Launch support'],
    icon: '🚀'
  },
  {
    number: '06',
    title: 'Ongoing Support',
    description: "Post-launch maintenance, updates, and optimization. We're with you for the long haul.",
    duration: 'Ongoing',
    deliverables: ['Bug fixes', 'Feature updates', 'Performance tuning', '24/7 support'],
    icon: '🤝'
  }
]

export default function ProcessPage() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Our <span className="gradient-text-animated">Development Process</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                A proven, agile methodology that delivers high-quality blockchain applications on time and on budget.
              </p>
            </motion.div>

            {/* Process Timeline */}
            <div ref={ref} className="space-y-16 max-w-5xl mx-auto">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute left-16 top-32 w-0.5 h-32 bg-gradient-to-b from-accent-blue to-accent-purple" />
                  )}

                  <div className="glass rounded-2xl p-8 md:p-10 hover-lift group">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Number & Icon */}
                      <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-2 flex-shrink-0">
                        <div className="text-6xl md:text-7xl font-bold gradient-text opacity-50 group-hover:opacity-100 transition-opacity">
                          {step.number}
                        </div>
                        <div className="text-5xl">{step.icon}</div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0 group-hover:text-accent-blue transition-colors">
                            {step.title}
                          </h3>
                          <span className="inline-block px-4 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-semibold">
                            {step.duration}
                          </span>
                        </div>

                        <p className="text-gray-400 mb-6 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Deliverables */}
                        <div>
                          <div className="text-sm font-semibold mb-3 text-gray-300">Key Deliverables:</div>
                          <div className="grid grid-cols-2 gap-3">
                            {step.deliverables.map((deliverable, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-300">{deliverable}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Methodology */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-20 glass rounded-2xl p-10 max-w-5xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Why Our Process Works</h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-bold mb-2">Agile & Iterative</h3>
                  <p className="text-gray-400 text-sm">
                    Regular sprints and demos keep you in the loop. Adapt quickly to changes.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-bold mb-2">Quality Focused</h3>
                  <p className="text-gray-400 text-sm">
                    Multiple review stages and automated testing ensure production-ready code.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="font-bold mb-2">Transparent</h3>
                  <p className="text-gray-400 text-sm">
                    Full visibility into progress, blockers, and timelines. No surprises.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <CTASection
          title="Ready to Start Your Project?"
          description="Let's discuss your requirements and create a custom development plan tailored to your needs."
          primaryButton={{
            text: "Schedule a Consultation",
            href: "/#contact"
          }}
          secondaryButton={{
            text: "View Our Work",
            href: "/portfolio"
          }}
        />
      </main>
      <Footer />
    </>
  )
}
