export default function About() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Qodestak</span>
          </h2>
        </div>

        <div className="space-y-6 text-lg text-gray-300">
          <p>
            Qodestak is a development firm specializing in blockchain infrastructure 
            and full-stack development. We combine deep technical expertise with a 
            commitment to delivering production-ready solutions that scale.
          </p>

          <p>
            Our team has extensive experience building and maintaining enterprise-grade 
            blockchain infrastructure, developing modern web applications, and creating 
            seamless Web3 integrations. We understand the complexities of distributed 
            systems and bring that knowledge to every project.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 bg-matte-gray rounded-lg">
              <div className="text-4xl font-bold gradient-text mb-2">10+</div>
              <div className="text-gray-400">Years Combined Experience</div>
            </div>
            <div className="text-center p-6 bg-matte-gray rounded-lg">
              <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
              <div className="text-gray-400">Infrastructure Uptime</div>
            </div>
            <div className="text-center p-6 bg-matte-gray rounded-lg">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-400">Support & Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
