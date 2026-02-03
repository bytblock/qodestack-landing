import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About Us - Qodestak',
  description: 'Learn about Qodestak\'s mission, values, and the team behind our blockchain and full-stack development services.',
}

export default function AboutPage() {
  const team = [
    {
      name: 'Technical Leadership',
      role: 'Architecture & Infrastructure',
      description: 'Enterprise-grade blockchain infrastructure and scalable system design'
    },
    {
      name: 'Development Team',
      role: 'Full-Stack Development',
      description: 'Modern web applications with cutting-edge technologies'
    },
    {
      name: 'DevOps Team',
      role: 'Infrastructure & Operations',
      description: 'Robust automation, deployment pipelines, and monitoring'
    }
  ]

  const values = [
    {
      title: 'Technical Excellence',
      description: 'We build production-grade infrastructure with enterprise reliability. Every system is designed for performance, security, and scalability.',
      icon: '⚡'
    },
    {
      title: 'Open Source First',
      description: 'We contribute to and leverage open source technologies. Transparent development and community-driven innovation.',
      icon: '🔓'
    },
    {
      title: 'Pragmatic Solutions',
      description: 'We choose the right tool for the job. No over-engineering, no unnecessary complexity—just effective solutions.',
      icon: '🎯'
    },
    {
      title: 'Security Minded',
      description: 'Security is built in from day one. Code reviews, audits, and best practices are non-negotiable.',
      icon: '🛡️'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'WhiteHilt Node Launch',
      description: 'Enterprise Ethereum RPC infrastructure with multi-chain support and 99.9% uptime SLA'
    },
    {
      year: '2024',
      title: 'Production Infrastructure',
      description: 'Deployed bare-metal servers optimized for blockchain operations with comprehensive monitoring'
    },
    {
      year: '2024',
      title: 'Full-Stack Platform',
      description: 'Modern web applications with Next.js 14, React 19, and production-ready architecture'
    },
    {
      year: '2025',
      title: 'Expanding Services',
      description: 'Growing our blockchain infrastructure and full-stack development capabilities'
    }
  ]

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding min-h-[50vh] flex items-center">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">Qodestak</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              We build blockchain infrastructure and full-stack applications that power the decentralized future.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding bg-matte-gray">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-300">
              <p>
                Qodestak specializes in blockchain infrastructure and full-stack development,
                delivering enterprise-grade solutions that combine technical excellence with
                practical implementation.
              </p>
              <p>
                Our expertise spans Ethereum node operations, Layer 2 scaling solutions, modern
                web application development, and comprehensive DevOps automation. We architect
                systems that are secure, scalable, and maintainable.
              </p>
              <p>
                From bare-metal server optimization to React applications, from Docker orchestration
                to smart contract integration—we handle the full technical stack with precision and
                attention to detail.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our <span className="gradient-text">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-matte-light p-8 rounded-xl border border-gray-800 hover:border-accent-purple transition-all duration-300"
                >
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding bg-matte-gray">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our <span className="gradient-text">Team</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-matte-light p-8 rounded-xl border border-gray-800 text-center hover:border-accent-blue transition-all duration-300"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-accent-blue mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex gap-6 group"
                >
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-2xl font-bold text-accent-purple">{milestone.year}</span>
                  </div>
                  <div className="flex-shrink-0 relative">
                    <div className="w-4 h-4 rounded-full bg-accent-blue group-hover:scale-125 transition-transform"></div>
                    {index !== milestones.length - 1 && (
                      <div className="absolute top-4 left-1/2 w-0.5 h-full bg-gray-800 -translate-x-1/2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-400">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-matte-gray">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Work <span className="gradient-text">Together?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Let's discuss how we can help with your blockchain infrastructure or development project.
            </p>
            <a
              href="/#contact"
              className="inline-block bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
