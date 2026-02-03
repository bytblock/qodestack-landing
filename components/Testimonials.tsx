export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'CTO',
      company: 'DeFi Protocol',
      image: '👩‍💼',
      quote: 'The infrastructure Qodestack built has been rock-solid for 8 months. We went from weekly outages to zero downtime. The monitoring dashboards give us complete visibility, and the automatic failover has saved us multiple times.',
      project: 'Ethereum RPC Infrastructure'
    },
    {
      name: 'Michael Chen',
      title: 'Managing Partner',
      company: 'Crypto Investment Fund',
      image: '👨‍💼',
      quote: 'This dashboard transformed our operations. We went from spending 20+ hours per week manually tracking positions to having everything in real-time. We\'ve prevented multiple liquidations and made faster decisions that directly impacted our returns. The ROI was immediate.',
      project: 'Real-Time DeFi Dashboard'
    },
    {
      name: 'Alex Rivera',
      title: 'Founder',
      company: 'Digital Art Platform',
      image: '🎨',
      quote: 'Qodestack delivered beyond our expectations. The lazy minting feature was a game-changer for our creators, and the enforced royalties give them confidence in the platform. We\'ve seen steady growth and excellent user feedback since launch.',
      project: 'NFT Marketplace'
    },
    {
      name: 'Jennifer Martinez',
      title: 'CTO',
      company: 'B2B SaaS Company',
      image: '💼',
      quote: 'The Kubernetes migration was a game-changer for our business. Not only did we cut infrastructure costs in half, but our engineering team is now deploying features multiple times per day instead of weekly. The reliability improvements have been remarkable.',
      project: 'Kubernetes Migration'
    },
    {
      name: 'David Park',
      title: 'Founder',
      company: 'Analytics Startup',
      image: '📊',
      quote: 'Qodestack delivered exactly what we needed. The indexer is blazing fast, incredibly reliable, and the GraphQL API makes it easy for our customers to query the data they need. We tried building this in-house but couldn\'t get the performance we needed.',
      project: 'Blockchain Indexer'
    },
    {
      name: 'Rachel Thompson',
      title: 'Head of Engineering',
      company: 'Fintech Startup',
      image: '💳',
      quote: 'Working with Qodestack was a breath of fresh air. They understood our requirements immediately and delivered a solution that exceeded our expectations. Their expertise in both blockchain and traditional infrastructure was invaluable.',
      project: 'Payment Processing System'
    },
    {
      name: 'James Wilson',
      title: 'VP of Product',
      company: 'Web3 Gaming Company',
      image: '🎮',
      quote: 'The smart contract architecture Qodestack designed saved us thousands in gas fees and made our NFT system incredibly efficient. Their security recommendations prevented what could have been a catastrophic vulnerability.',
      project: 'Web3 Gaming Platform'
    },
    {
      name: 'Lisa Anderson',
      title: 'CEO',
      company: 'DAO Platform',
      image: '🏛️',
      quote: 'Qodestack\'s DevOps expertise transformed our deployment process. We went from manual, error-prone deployments to a fully automated CI/CD pipeline. The peace of mind knowing our infrastructure is solid is priceless.',
      project: 'DAO Infrastructure'
    }
  ]

  return (
    <section id="testimonials" className="section-padding bg-matte-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real feedback from real projects. We measure success by the impact we deliver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-matte-light p-8 rounded-xl border border-gray-800 hover:border-accent-blue transition-all duration-300 flex flex-col"
            >
              {/* Quote Icon */}
              <div className="text-4xl text-accent-purple mb-4">"</div>

              {/* Quote Text */}
              <p className="text-gray-300 mb-6 flex-grow leading-relaxed">
                {testimonial.quote}
              </p>

              {/* Project Reference */}
              <div className="text-sm text-accent-blue mb-4 font-medium">
                {testimonial.project}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 border-t border-gray-800 pt-4">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.title}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">50+</div>
            <div className="text-gray-400">Projects Delivered</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">99.9%</div>
            <div className="text-gray-400">Uptime SLA</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">100M+</div>
            <div className="text-gray-400">Requests/Day</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-gray-400">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
