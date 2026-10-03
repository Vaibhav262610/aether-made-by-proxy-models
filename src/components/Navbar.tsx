'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '#experience', label: 'Experience' },
  { href: '#features', label: 'Features' },
  { href: '#showcase', label: 'Showcase' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [mobileOpen])

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-20" aria-label="Main navigation">
        <div className="container-main h-full flex items-center justify-between" />
      </nav>
    )
  }

  return (
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-slow ease-out-expo ${
        scrolled ? 'bg-background/90 backdrop-blur-2xl border-b border-borderSubtle shadow-xl' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      aria-label="Main navigation"
    >
      <div className="container-main h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="relative flex items-center gap-3 z-50"
          aria-label="AETHER Home"
          onClick={() => setMobileOpen(false)}
        >
          <motion.div
            className="relative w-10 h-10 rounded-radius-lg overflow-hidden"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00e5d0" />
                  <stop offset="100%" stopColor="#ffd75e" />
                </linearGradient>
              </defs>
              <path
                d="M20 2 L35 12 V28 L20 38 L5 28 V12 L20 2 Z"
                stroke="url(#logoGradient)"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="20" cy="20" r="6" fill="url(#logoGradient)" opacity="0.3" />
              <circle cx="20" cy="20" r="3" fill="#00e5d0" />
            </svg>
          </motion.div>
          <span className="font-display font-semibold text-heading-md text-foreground tracking-tight">
            AETHER
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-label-md font-medium text-foregroundMuted hover:text-foreground transition-colors duration-fast rounded-radius-md hover:bg-surface"
                onClick={() => setMobileOpen(false)}
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.4, ease: 'easeOut' }}
                  className="inline-block"
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Link
              href="#contact"
              className="btn-secondary text-sm px-6 py-2.5"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="relative md:hidden flex items-center justify-center w-12 h-12 rounded-radius-lg bg-surface border border-borderSubtle hover:border-accent/50 hover:bg-accentDim transition-all duration-fast z-50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.span
            className="absolute w-6 h-0.5 bg-foreground rounded-full"
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 0 : -6 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute w-6 h-0.5 bg-foreground rounded-full"
            animate={{ opacity: mobileOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute w-6 h-0.5 bg-foreground rounded-full"
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? 0 : 6 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-0 h-dvh z-40 bg-background/[0.98] backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-display-sm font-display font-medium text-foreground text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
                    className="inline-block"
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
            <motion.div
              className="pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
            >
              <Link
                href="#contact"
                className="btn-primary px-10 py-3"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
