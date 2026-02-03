'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTASection from '@/components/CTASection'

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Blockchain Architect',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: '10+ years in blockchain development. Built infrastructure handling $1B+ in transactions.',
    skills: ['Ethereum', 'Solidity', 'System Design'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#'
    }
  },
  {
    name: 'Sarah Martinez',
    role: 'CTO & Full-Stack Lead',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Expert in scalable architectures. Former tech lead at major Web3 protocols.',
    skills: ['Node.js', 'React', 'PostgreSQL'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#'
    }
  },
  {
    name: 'Michael Kim',
    role: 'Lead Smart Contract Engineer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Security-first mindset. Audited 100+ smart contracts with zero exploits.',
    skills: ['Solidity', 'Security', 'Hardhat'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#'
    }
  },
  {
    name: 'Emily Taylor',
    role: 'Head of DevOps',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Infrastructure wizard. Manages systems processing millions of requests daily.',
    skills: ['Kubernetes', 'AWS', 'Terraform'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#'
    }
  },
  {
    name: 'David Park',
    role: 'Senior Frontend Engineer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'UX-focused developer. Creates beautiful interfaces users love.',
    skills: ['React', 'Next.js', 'TypeScript'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#'
    }
  },
  {
    name: 'Lisa Wong',
    role: 'Product Manager',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    bio: 'Bridges business and technology. Shipped 30+ successful Web3 products.',
    skills: ['Strategy', 'Agile', 'User Research'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#'
    }
  }
]

export default function TeamPage() {
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
          <div className="absolute inset-0 dot-pattern opacity-20" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Meet Our <span className="gradient-text-animated">Expert Team</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                A talented group of engineers, designers, and strategists passionate about building the future of Web3.
              </p>
            </motion.div>

            {/* Team Grid */}
            <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-2xl overflow-hidden hover-lift group"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <div className="text-accent-blue font-semibold mb-4">{member.role}</div>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{member.bio}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-matte-light rounded-full text-xs text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                      <a
                        href={member.social.linkedin}
                        className="text-gray-400 hover:text-accent-blue transition-colors"
                        aria-label="LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                      <a
                        href={member.social.github}
                        className="text-gray-400 hover:text-accent-purple transition-colors"
                        aria-label="GitHub"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a
                        href={member.social.twitter}
                        className="text-gray-400 hover:text-accent-cyan transition-colors"
                        aria-label="Twitter"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Culture Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-20"
            >
              <div className="glass rounded-2xl p-10 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">Our Culture</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl mb-3">🚀</div>
                    <h3 className="font-bold mb-2">Innovation First</h3>
                    <p className="text-gray-400 text-sm">
                      We embrace cutting-edge technologies and push the boundaries of what's possible.
                    </p>
                  </div>
                  <div>
                    <div className="text-4xl mb-3">🤝</div>
                    <h3 className="font-bold mb-2">Collaboration</h3>
                    <p className="text-gray-400 text-sm">
                      Diverse perspectives lead to better solutions. We thrive on teamwork.
                    </p>
                  </div>
                  <div>
                    <div className="text-4xl mb-3">📚</div>
                    <h3 className="font-bold mb-2">Continuous Learning</h3>
                    <p className="text-gray-400 text-sm">
                      The tech landscape evolves rapidly. We stay ahead through constant learning.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <CTASection
          title="Want to Join Our Team?"
          description="We're always looking for talented individuals who are passionate about blockchain technology and building the future of Web3."
          primaryButton={{
            text: "View Open Positions",
            href: "/careers"
          }}
          secondaryButton={{
            text: "Learn About Our Culture",
            href: "/about"
          }}
        />
      </main>
      <Footer />
    </>
  )
}
