export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center section-padding pt-32 page-fade-in">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-on-scroll">
          Ship Production-Grade{' '}
          <span className="gradient-text">Blockchain & Web3 Apps</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-on-scroll animate-delay-200">
          From Ethereum infrastructure to full-stack dApps. We build scalable, secure systems
          that handle millions of requests per day. Zero downtime. Zero compromises.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll animate-delay-400">
          <a
            href="#contact"
            className="bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-smooth hover:scale-105 hover:shadow-2xl"
          >
            Start Your Project
          </a>
          <a
            href="/case-studies"
            className="border-2 border-accent-purple hover:bg-accent-purple hover:bg-opacity-10 text-white font-semibold px-8 py-4 rounded-lg transition-smooth hover:scale-105"
          >
            View Case Studies
          </a>
        </div>
      </div>
    </section>
  )
}
