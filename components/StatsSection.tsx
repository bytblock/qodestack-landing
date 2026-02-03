'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import AnimatedCounter from './AnimatedCounter'

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 99, suffix: '.9%', label: 'Uptime Guarantee' },
  { value: 100, suffix: 'M+', label: 'Requests/Day Handled' },
  { value: 24, suffix: '/7', label: 'Support Available' }
]

export default function StatsSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <section ref={ref} className="section-padding bg-gradient-to-b from-matte-black to-matte-gray">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center glass p-8 rounded-2xl hover-lift"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  className="gradient-text"
                />
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
