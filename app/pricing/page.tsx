'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: 5000,
    priceMonthly: 500,
    description: 'Perfect for small projects and MVPs',
    features: [
      'Single smart contract deployment',
      'Basic frontend integration',
      '1 month of support',
      'Security audit',
      'Documentation',
      'Gas optimization',
      'Testnet deployment'
    ],
    popular: false,
    color: 'blue'
  },
  {
    name: 'Professional',
    price: 15000,
    priceMonthly: 1500,
    description: 'Best for growing businesses',
    features: [
      'Multiple smart contracts',
      'Full-stack dApp development',
      '3 months of support',
      'Comprehensive security audit',
      'Complete documentation',
      'Advanced gas optimization',
      'Mainnet deployment',
      'CI/CD pipeline setup',
      'Admin dashboard',
      'API integration'
    ],
    popular: true,
    color: 'purple'
  },
  {
    name: 'Enterprise',
    price: 50000,
    priceMonthly: 5000,
    description: 'For mission-critical applications',
    features: [
      'Complex smart contract systems',
      'Enterprise-grade infrastructure',
      '12 months of support',
      'Multi-layer security audits',
      'Full technical documentation',
      'Maximum gas optimization',
      'Multi-chain deployment',
      'Complete DevOps setup',
      'Custom admin panel',
      'Full API suite',
      'Performance monitoring',
      'Dedicated support team',
      '99.9% uptime SLA',
      'White-glove onboarding'
    ],
    popular: false,
    color: 'cyan'
  }
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'project' | 'monthly'>('project')
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <>
      <Header />
      <main className="pt-32">
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-30" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Simple, <span className="gradient-text-animated">Transparent Pricing</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
                Choose the perfect plan for your blockchain project. All plans include our commitment to quality and security.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center gap-4 glass p-2 rounded-full">
                <button
                  onClick={() => setBillingCycle('project')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    billingCycle === 'project'
                      ? 'bg-accent-blue text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Project-Based
                </button>
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-accent-blue text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Monthly Retainer
                </button>
              </div>
            </motion.div>

            {/* Pricing Cards */}
            <div ref={ref} className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative glass rounded-2xl p-8 ${
                    plan.popular ? 'border-2 border-accent-purple scale-105' : ''
                  } hover-lift`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent-purple text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold gradient-text">
                        ${billingCycle === 'project' ? plan.price.toLocaleString() : plan.priceMonthly.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        {billingCycle === 'project' ? 'per project' : '/ month'}
                      </span>
                    </div>

                    <Link
                      href="/#contact"
                      className={`block w-full py-3 rounded-lg font-semibold transition-all duration-300 hover-scale ${
                        plan.popular
                          ? 'bg-accent-purple hover:bg-purple-600 text-white'
                          : 'glass border border-accent-blue hover:bg-accent-blue hover:bg-opacity-20 text-white'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <div className="font-semibold text-sm text-gray-400 mb-3">What's included:</div>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-20 text-center"
            >
              <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">All plans include:</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl mb-2">🔒</div>
                    <div className="font-semibold mb-1">Security First</div>
                    <div className="text-sm text-gray-400">Industry-leading security practices</div>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="font-semibold mb-1">Fast Delivery</div>
                    <div className="text-sm text-gray-400">Agile development process</div>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="font-semibold mb-1">100% Custom</div>
                    <div className="text-sm text-gray-400">Tailored to your needs</div>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">💎</div>
                    <div className="font-semibold mb-1">Quality Code</div>
                    <div className="text-sm text-gray-400">Production-ready from day one</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <CTASection
          title="Need a Custom Solution?"
          description="Every project is unique. Let's discuss your specific requirements and create a tailored plan that fits your needs perfectly."
          primaryButton={{
            text: "Schedule a Call",
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
