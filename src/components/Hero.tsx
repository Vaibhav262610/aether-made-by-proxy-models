'use client'

import { motion } from 'framer-motion'
import { Hero3D } from './Scene3D'
import Link from 'next/link'

interface HeroProps {
  scrollProgress: number
}

export default function Hero({ scrollProgress }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Radial gradient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-accent/10 via-transparent to-transparent"
          style={{
            filter: 'blur(120px)',
            transformOrigin: 'center',
            transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 0.5})`,
            opacity: 1 - scrollProgress * 0.3,
          }}
        />
        {/* Gold glow */}
        <div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-gold/5 via-transparent to-transparent"
          style={{
            filter: 'blur(150px)',
            transformOrigin: 'center',
            transform: `translate(0, ${-scrollProgress * 100}px) scale(${1 + scrollProgress * 0.3})`,
            opacity: 1 - scrollProgress * 0.2,
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translateY(${scrollProgress * 50}px)`,
          }}
        />
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-10">
        <Hero3D scrollProgress={scrollProgress} />
        <div className="absolute inset-0 bg-background/50 pointer-events-none" aria-hidden="true" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full container-main px-6 md:px-10 lg:px-16 pt-28 pb-32">
        <div className="max-w-[900px] mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-radius-full bg-surface/80 backdrop-blur-xl border border-borderSubtle mb-8"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <span className="text-label-md font-medium text-foregroundMuted tracking-wider uppercase">
              Spatial Computing Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            className="font-display font-semibold text-[clamp(2.75rem,10vw,9rem)] leading-[0.95] tracking-tight text-foreground mb-8"
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            style={{ textWrap: 'balance' }}
          >
            <span className="block">Reality,</span>
            <span className="block text-gradient">Redesigned.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-body-lg md:text-body-lg lg:text-body-lg text-foregroundMuted max-w-[650px] mx-auto mb-12 font-normal leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            AETHER transforms how you experience digital space. Build immersive
            worlds that respond to thought, gesture, and presence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          >
            <Link
              href="#experience"
              className="btn-primary group"
              aria-label="Start building with AETHER"
            >
              <span>Begin Building</span>
              <motion.svg
                className="w-5 h-5 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </Link>
            <Link
              href="#showcase"
              className="btn-secondary"
              aria-label="Watch demo of AETHER"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Watch Demo</span>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-foregroundSubtle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <span className="text-label-sm font-medium tracking-wider uppercase">Scroll</span>
            <motion.svg
              className="w-6 h-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
