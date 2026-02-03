'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What services does Qodestak offer?',
        a: 'We specialize in blockchain infrastructure, smart contract development, full-stack dApp creation, DevOps, and Web3 integration. From Ethereum nodes to complete enterprise solutions.'
      },
      {
        q: 'How long does a typical project take?',
        a: 'Project timelines vary based on complexity. Simple smart contracts can take 2-4 weeks, while full dApp platforms typically require 2-4 months. We provide detailed estimates during consultation.'
      },
      {
        q: 'Do you work with startups or only enterprises?',
        a: 'We work with both! Our Starter plan is perfect for early-stage startups and MVPs, while our Enterprise plan handles mission-critical applications for large organizations.'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'Which blockchains do you support?',
        a: 'We primarily focus on Ethereum and EVM-compatible chains (Polygon, BSC, Arbitrum, Optimism). We also have experience with Solana, Hyperledger, and custom blockchain solutions.'
      },
      {
        q: 'How do you ensure smart contract security?',
        a: 'Every contract undergoes: internal code review, automated security scans, manual audit by security experts, gas optimization, and testnet deployment before mainnet launch.'
      },
      {
        q: 'What about post-launch support?',
        a: 'All plans include post-launch support. Starter gets 1 month, Professional gets 3 months, and Enterprise gets 12 months of ongoing maintenance and updates.'
      }
    ]
  },
  {
    category: 'Pricing & Process',
    questions: [
      {
        q: 'How does your pricing work?',
        a: 'We offer both project-based and monthly retainer pricing. Project-based is great for defined scopes, while monthly retainers work well for ongoing development and support.'
      },
      {
        q: 'What is your development process?',
        a: 'We follow an agile methodology: initial consultation → technical specification → iterative development → testing & security audit → deployment → ongoing support.'
      },
      {
        q: 'Do you sign NDAs?',
        a: 'Absolutely. We understand the sensitive nature of blockchain projects and are happy to sign mutual NDAs before discussing your project details.'
      }
    ]
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <>
      <Header />
      <main className="pt-32">
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Frequently Asked <span className="gradient-text-animated">Questions</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to know about working with Qodestak. Can't find an answer? Contact us directly.
              </p>
            </motion.div>

            {faqs.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold mb-6 text-accent-blue">{category.category}</h2>

                <div className="space-y-4">
                  {category.questions.map((faq, qIndex) => {
                    const key = `${catIndex}-${qIndex}`
                    const isOpen = openIndex === key

                    return (
                      <div
                        key={qIndex}
                        className="glass rounded-xl overflow-hidden hover:border-accent-blue transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFAQ(catIndex, qIndex)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-matte-light transition-colors"
                        >
                          <span className="font-semibold text-lg pr-4">{faq.q}</span>
                          <svg
                            className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 glass rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-gray-400 mb-6">
                Our team is here to help. Reach out and we'll get back to you within 24 hours.
              </p>
              <a
                href="/#contact"
                className="inline-block bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover-scale"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
