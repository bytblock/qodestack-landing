import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Service {
  slug: string
  title: string
  description: string
  icon: string
  overview: string
  features: {
    title: string
    description: string
  }[]
  techStack: string[]
  caseStudy: {
    title: string
    challenge: string
    solution: string
    results: string[]
  }
}

const services: Record<string, Service> = {
  'blockchain-infrastructure': {
    slug: 'blockchain-infrastructure',
    title: 'Blockchain Infrastructure',
    description: 'Enterprise-grade blockchain nodes and RPC infrastructure',
    icon: '⛓️',
    overview: 'We provide production-ready blockchain infrastructure that powers decentralized applications and services. Our solutions are built for reliability, performance, and scalability, with comprehensive monitoring and 24/7 uptime.',
    features: [
      {
        title: 'Multi-Chain Node Operations',
        description: 'Ethereum mainnet and Layer 2 solutions (Optimism, Arbitrum, Base) with high-performance execution and consensus clients.'
      },
      {
        title: 'RPC Infrastructure',
        description: 'Load-balanced RPC endpoints with automatic failover, rate limiting, and analytics. RESTful API with WebSocket support.'
      },
      {
        title: 'Monitoring & Analytics',
        description: 'Real-time metrics with Prometheus and Grafana. Track sync status, peer count, block height, and system resources.'
      },
      {
        title: 'High Availability',
        description: 'Redundant node configurations, automated health checks, and instant alerting for any issues.'
      }
    ],
    techStack: ['Reth', 'Lighthouse', 'Geth', 'Docker', 'Prometheus', 'Grafana', 'Redis', 'ClickHouse'],
    caseStudy: {
      title: 'WhiteHilt Node: Production RPC Infrastructure',
      challenge: 'Building a reliable, high-performance Ethereum RPC infrastructure capable of handling production workloads with 99.9% uptime requirements.',
      solution: 'Deployed bare-metal Hetzner AX102 servers with Reth execution client and Lighthouse consensus client. Implemented comprehensive monitoring with Prometheus/Grafana, load balancing with BFF API layer, and automated alerting.',
      results: [
        '7-10 day mainnet sync time with optimized MDBX storage',
        'Sub-second RPC response times with caching layer',
        '99.9% uptime SLA achieved with automated failover',
        'Real-time metrics dashboard for complete visibility'
      ]
    }
  },
  'full-stack-development': {
    slug: 'full-stack-development',
    title: 'Full-Stack Development',
    description: 'Modern web applications built with cutting-edge technologies',
    icon: '💻',
    overview: 'We build scalable, maintainable web applications using the latest frameworks and best practices. From server-side rendering to API development, we handle the complete stack with production-grade quality.',
    features: [
      {
        title: 'Next.js Applications',
        description: 'Server-side rendering, static generation, and API routes with Next.js 14 App Router. Optimized performance and SEO.'
      },
      {
        title: 'React Development',
        description: 'Modern React 19 with hooks, context, and state management. TypeScript for type safety and better developer experience.'
      },
      {
        title: 'Backend APIs',
        description: 'RESTful and GraphQL APIs with Node.js. Database design with PostgreSQL, MongoDB, or Redis based on requirements.'
      },
      {
        title: 'Responsive Design',
        description: 'Mobile-first responsive design with Tailwind CSS. Accessibility compliance and cross-browser compatibility.'
      }
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Redis'],
    caseStudy: {
      title: 'Qodestack Landing: Modern Marketing Site',
      challenge: 'Create a production-ready marketing site with blog functionality, service pages, and contact forms while maintaining excellent performance and SEO.',
      solution: 'Built with Next.js 14 App Router and React 19, using Tailwind CSS for styling. Implemented dynamic routing for services and blog posts, form validation with react-hook-form, and optimized images with next/image.',
      results: [
        '100/100 Lighthouse performance score',
        'Server-side rendering for instant page loads',
        'Fully responsive mobile-first design',
        'SEO optimized with proper metadata'
      ]
    }
  },
  'web3-integration': {
    slug: 'web3-integration',
    title: 'Web3 Integration',
    description: 'Seamless Web3 connectivity for decentralized applications',
    icon: '🌐',
    overview: 'We integrate blockchain functionality into web applications with wallet connectivity, smart contract interactions, and decentralized data storage. Our solutions make Web3 accessible and user-friendly.',
    features: [
      {
        title: 'Wallet Integration',
        description: 'Support for MetaMask, WalletConnect, Coinbase Wallet, and other popular Web3 wallets. Seamless connection and transaction signing.'
      },
      {
        title: 'Smart Contract Development',
        description: 'Solidity smart contracts with comprehensive testing and auditing. Gas optimization and security best practices.'
      },
      {
        title: 'DApp Development',
        description: 'Full-stack decentralized applications with on-chain and off-chain components. IPFS integration for decentralized storage.'
      },
      {
        title: 'NFT Solutions',
        description: 'NFT minting platforms, marketplaces, and galleries. ERC-721 and ERC-1155 standards with metadata management.'
      }
    ],
    techStack: ['Ethers.js', 'Web3.js', 'Wagmi', 'RainbowKit', 'Solidity', 'Hardhat', 'IPFS', 'The Graph'],
    caseStudy: {
      title: 'USDT Broadcaster: Transaction Monitoring',
      challenge: 'Monitor USDT transactions across multiple addresses in real-time and broadcast alerts for specific transaction patterns.',
      solution: 'Built a Node.js service using ethers.js to subscribe to blockchain events. Implemented WebSocket connections for real-time updates and filtering logic for transaction patterns.',
      results: [
        'Real-time monitoring of multiple addresses',
        'Sub-second alert delivery for matching transactions',
        'Reliable event subscription with automatic reconnection',
        'Low latency with optimized RPC usage'
      ]
    }
  },
  'devops-infrastructure': {
    slug: 'devops-infrastructure',
    title: 'DevOps & Infrastructure',
    description: 'Robust automation and deployment pipelines',
    icon: '🚀',
    overview: 'We automate infrastructure provisioning, deployment, and monitoring to ensure reliable operations. From Docker containers to Kubernetes orchestration, we build systems that scale.',
    features: [
      {
        title: 'Container Orchestration',
        description: 'Docker and Docker Compose for development and production. Kubernetes for large-scale deployments with auto-scaling.'
      },
      {
        title: 'CI/CD Pipelines',
        description: 'Automated testing, building, and deployment with GitHub Actions, GitLab CI, or Jenkins. Zero-downtime deployments.'
      },
      {
        title: 'Infrastructure as Code',
        description: 'Terraform and Ansible for reproducible infrastructure. Version-controlled configurations and automated provisioning.'
      },
      {
        title: 'Monitoring & Logging',
        description: 'Prometheus, Grafana, and Loki for metrics and logs. Alertmanager for incident response and on-call automation.'
      }
    ],
    techStack: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GitHub Actions', 'Prometheus', 'Grafana', 'Nginx'],
    caseStudy: {
      title: 'WhiteHilt Node: Production Deployment',
      challenge: 'Deploy and manage complex blockchain infrastructure with multiple services, monitoring, and automated failover across bare-metal servers.',
      solution: 'Containerized all services with Docker Compose. Implemented Prometheus/Grafana monitoring stack, Caddy reverse proxy with automatic HTTPS, and systemd integration for service management.',
      results: [
        '16 services orchestrated with single docker-compose.yml',
        'Automated health checks and service recovery',
        'Centralized logging with Loki and log aggregation',
        'Real-time alerts via Alertmanager for critical issues'
      ]
    }
  }
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = services[params.slug]

  if (!service) {
    return {
      title: 'Service Not Found - Qodestack',
    }
  }

  return {
    title: `${service.title} - Qodestack`,
    description: service.description,
  }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = services[params.slug]

  if (!service) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding min-h-[50vh] flex items-center bg-matte-gray">
          <div className="max-w-5xl mx-auto text-center">
            <div className="text-7xl mb-6">{service.icon}</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">{service.title}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              {service.description}
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Overview</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {service.overview}
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-matte-gray">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Key <span className="gradient-text">Features</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-matte-light p-8 rounded-xl border border-gray-800 hover:border-accent-blue transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-3 text-accent-blue">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Technology <span className="gradient-text">Stack</span>
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {service.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="bg-matte-light px-6 py-3 rounded-lg border border-gray-800 text-gray-300 font-medium hover:border-accent-purple transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="section-padding bg-matte-gray">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Case <span className="gradient-text">Study</span>
            </h2>
            <div className="bg-matte-light p-8 md:p-12 rounded-xl border border-gray-800">
              <h3 className="text-2xl font-bold mb-6 text-accent-blue">
                {service.caseStudy.title}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-accent-purple">Challenge</h4>
                  <p className="text-gray-300">{service.caseStudy.challenge}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2 text-accent-purple">Solution</h4>
                  <p className="text-gray-300">{service.caseStudy.solution}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2 text-accent-purple">Results</h4>
                  <ul className="space-y-2">
                    {service.caseStudy.results.map((result, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="text-accent-blue mr-3 mt-1">✓</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get <span className="gradient-text">Started?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Let's discuss how we can help with your {service.title.toLowerCase()} needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </Link>
              <Link
                href="/#services"
                className="border-2 border-accent-purple hover:bg-accent-purple hover:bg-opacity-10 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
