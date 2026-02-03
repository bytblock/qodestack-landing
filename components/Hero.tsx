export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Build the Future with{' '}
          <span className="gradient-text">Qodestack</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Professional blockchain infrastructure and full-stack development services.
          We turn complex technical challenges into elegant solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </a>
          <a
            href="#services"
            className="border-2 border-accent-purple hover:bg-accent-purple hover:bg-opacity-10 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
          >
            Our Services
          </a>
        </div>
      </div>
    </section>
  )
}
