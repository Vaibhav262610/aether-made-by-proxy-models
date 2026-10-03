'use client'

import { motion } from 'framer-motion'

const trustMarks = [
  { name: 'VERCEL', initial: 'V' },
  { name: 'LINEAR', initial: 'L' },
  { name: 'NOTION', initial: 'N' },
  { name: 'FIGMA', initial: 'F' },
  { name: 'STRIPE', initial: 'S' },
  { name: 'GITHUB', initial: 'G' },
]

export default function TrustSection() {
  return (
    <section
      id="trust"
      className="section-sm border-y border-borderSubtle relative overflow-hidden"
      aria-labelledby="trust-heading"
    >
      <div className="container-main">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2
            id="trust-heading"
            className="sr-only"
          >
            Trusted by industry leaders
          </h2>
          <p className="text-label-md font-medium text-accent tracking-widest uppercase">
            Trusted by teams shaping the future
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated divider lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" aria-hidden="true" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2" aria-hidden="true">
            <motion.div
              className="absolute top-0 left-0 h-full w-1/6 bg-gradient-to-r from-transparent via-accent to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
          </div>

          <div className="relative flex items-center justify-center gap-8 md:gap-12 lg:gap-16 flex-wrap">
            {trustMarks.map((mark, index) => (
              <motion.div
                key={mark.name}
                className="flex items-center gap-3 px-6 py-3 rounded-radius-xl bg-surface/60 backdrop-blur-xl border border-borderSubtle hover:border-accent/50 hover:bg-accentDim transition-all duration-normal group"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div
                  className="w-10 h-10 rounded-radius-lg flex items-center justify-center font-display font-bold text-heading-sm text-foreground"
                  style={{
                    background: `linear-gradient(135deg, ${index % 2 === 0 ? '#00e5d0' : '#ffd75e'}20, ${index % 2 === 0 ? '#00b8a8' : '#e6bf4a'}20)`,
                    border: `1px solid ${index % 2 === 0 ? '#00e5d0' : '#ffd75e'}40`,
                  }}
                  aria-hidden="true"
                >
                  {mark.initial}
                </div>
                <span className="font-medium text-body-sm text-foregroundMuted group-hover:text-foreground transition-colors">
                  {mark.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          {[
            { value: '10,000+', label: 'Active developers' },
            { value: '2.5M', label: 'Spatial sessions' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '<50ms', label: 'Global latency' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-4 md:p-6 relative"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent rounded-radius-lg opacity-0 group-hover:opacity-100 transition-opacity duration-normal"
                  aria-hidden="true"
                />
                <div className="relative text-display-md font-display font-bold text-gradient-accent">
                  {stat.value}
                </div>
              </div>
              <p className="mt-3 text-label-md text-foregroundMuted font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
