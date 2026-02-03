import Link from 'next/link'

export default function Services() {
  const services = [
    {
      title: 'Blockchain Infrastructure',
      description: 'Enterprise-grade blockchain nodes, RPC infrastructure, and validator services. Multi-chain support with high availability and monitoring.',
      icon: '⛓️',
      slug: 'blockchain-infrastructure',
      features: ['Ethereum & Layer 2', 'Node Operations', 'RPC Infrastructure', 'Monitoring & Analytics']
    },
    {
      title: 'Full-Stack Development',
      description: 'Modern web applications built with cutting-edge technologies. From concept to deployment, we deliver scalable solutions.',
      icon: '💻',
      slug: 'full-stack-development',
      features: ['React & Next.js', 'Node.js Backend', 'API Development', 'Database Design']
    },
    {
      title: 'Web3 Integration',
      description: 'Seamless Web3 integration for your applications. Smart contracts, wallet connectivity, and decentralized systems.',
      icon: '🌐',
      slug: 'web3-integration',
      features: ['Smart Contracts', 'Wallet Integration', 'DApp Development', 'NFT Solutions']
    },
    {
      title: 'DevOps & Infrastructure',
      description: 'Robust infrastructure automation and deployment pipelines. Docker, Kubernetes, and cloud-native solutions.',
      icon: '🚀',
      slug: 'devops-infrastructure',
      features: ['CI/CD Pipelines', 'Container Orchestration', 'Cloud Infrastructure', 'Monitoring & Logging']
    }
  ]

  return (
    <section id="services" className="section-padding bg-matte-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive technical solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href={`/services/${service.slug}`}
              className="bg-matte-light p-8 rounded-xl border border-gray-800 hover:border-accent-blue transition-all duration-300 group block"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent-blue transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 mb-6">
                {service.description}
              </p>
              <ul className="space-y-2 mb-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <span className="text-accent-purple mr-2">→</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-accent-blue font-semibold flex items-center">
                Learn More
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
