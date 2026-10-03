'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Documentation', href: '#docs' },
    { label: 'API Reference', href: '#api' },
    { label: 'Changelog', href: '#changelog' },
  ],
  company: [
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Careers', href: '#careers' },
    { label: 'Press', href: '#press' },
    { label: 'Contact', href: '#contact' },
  ],
  resources: [
    { label: 'Community', href: '#community' },
    { label: 'Discord', href: '#discord' },
    { label: 'GitHub', href: '#github' },
    { label: 'Status', href: '#status' },
    { label: 'Support', href: '#support' },
  ],
  legal: [
    { label: 'Privacy', href: '#privacy' },
    { label: 'Terms', href: '#terms' },
    { label: 'Security', href: '#security' },
    { label: 'Cookies', href: '#cookies' },
    { label: 'Licenses', href: '#licenses' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.724h-3.304l-7.63-8.699-7.893 8.699h-3.305l8.657-9.804L1.836 2.25h3.377l7.17 8.015L22.104 2.25z" />
    </svg>
  )},
  { name: 'GitHub', href: '#', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )},
  { name: 'Discord', href: '#', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.618-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.99 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.007-.128 10.02 10.02 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.244.206.372.293a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.364 1.225 1.993a.077.077 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.673-3.548-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )},
  { name: 'LinkedIn', href: '#', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )},
]

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-borderSubtle"
      role="contentinfo"
      aria-label="Footer"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-radial from-accent/5 via-transparent to-transparent"
        style={{ filter: 'blur(100px)', pointerEvents: 'none' }}
        aria-hidden="true"
      />

      <div className="container-main py-16 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-16">
          {/* Brand */}
          <motion.div
            className="col-span-2 md:col-span-4 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Link href="/" className="flex items-center gap-3 mb-6" aria-label="AETHER Home">
              <div className="relative w-10 h-10 rounded-radius-lg overflow-hidden">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#00e5d0" />
                      <stop offset="100%" stopColor="#ffd75e" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 2 L35 12 V28 L20 38 L5 28 V12 L20 2 Z"
                    stroke="url(#footerLogoGradient)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <circle cx="20" cy="20" r="6" fill="url(#footerLogoGradient)" opacity="0.3" />
                  <circle cx="20" cy="20" r="3" fill="#00e5d0" />
                </svg>
              </div>
              <span className="font-display font-semibold text-heading-md text-foreground tracking-tight">
                AETHER
              </span>
            </Link>
            <p className="text-body-sm text-foregroundMuted leading-relaxed mb-6 max-w-[250px]">
              Reality, redesigned. Building the future of spatial computing.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-radius-lg flex items-center justify-center bg-surface border border-borderSubtle text-foregroundMuted hover:border-accent/50 hover:text-accent hover:bg-accentDim transition-all duration-fast"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation columns */}
          {Object.entries(footerLinks).map(([category, links], catIndex) => (
            <motion.nav
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 + catIndex * 0.05, ease: 'easeOut' }}
              aria-label={category.charAt(0).toUpperCase() + category.slice(1)}
            >
              <h3 className="font-medium text-label-lg text-foreground uppercase tracking-wider mb-4">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-foregroundMuted hover:text-accent transition-colors duration-fast flex items-center gap-2 group"
                    >
                      <span>{link.label}</span>
                      <motion.svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </motion.svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="relative h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-transparent via-accent to-transparent"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            className="text-body-sm text-foregroundSubtle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            &copy; {new Date().getFullYear()} AETHER. All rights reserved.
          </motion.p>

          <motion.div
            className="flex items-center gap-6 text-body-sm text-foregroundSubtle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link href="#privacy" className="hover:text-accent transition-colors">Privacy</Link>
            <span aria-hidden="true">·</span>
            <Link href="#terms" className="hover:text-accent transition-colors">Terms</Link>
            <span aria-hidden="true">·</span>
            <Link href="#security" className="hover:text-accent transition-colors">Security</Link>
          </motion.div>

          <motion.p
            className="text-body-sm text-foregroundSubtle font-mono"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            v1.0.0-next
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
