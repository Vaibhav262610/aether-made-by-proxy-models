import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium dark theme
        background: '#0a0a0f',
        surface: '#111118',
        surfaceElevated: '#181820',
        border: '#2a2a36',
        borderSubtle: '#1e1e2a',

        // Text
        foreground: '#f5f5f7',
        foregroundMuted: '#8b8b9a',
        foregroundSubtle: '#5a5a6e',

        // Accent - sophisticated cyan/teal
        accent: '#00e5d0',
        accentMuted: '#00b8a8',
        accentGlow: 'rgba(0, 229, 208, 0.4)',
        accentDim: 'rgba(0, 229, 208, 0.1)',

        // Secondary - warm gold
        gold: '#ffd75e',
        goldMuted: '#e6bf4a',
        goldGlow: 'rgba(255, 215, 94, 0.3)',
        goldDim: 'rgba(255, 215, 94, 0.08)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(4.5rem, 12vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.75rem, 4vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'heading-xl': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-lg': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.25', letterSpacing: '-0.005em' }],
        'heading-md': ['clamp(1.125rem, 2vw, 1.375rem)', { lineHeight: '1.3', letterSpacing: '0' }],
        'heading-sm': ['clamp(1rem, 1.5vw, 1.125rem)', { lineHeight: '1.35', letterSpacing: '0' }],
        'body-lg': ['clamp(1.125rem, 1.5vw, 1.25rem)', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-md': ['clamp(1rem, 1.2vw, 1.125rem)', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['clamp(0.875rem, 1vw, 1rem)', { lineHeight: '1.55', letterSpacing: '0' }],
        'label-lg': ['clamp(0.875rem, 1vw, 1rem)', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'label-md': ['clamp(0.8125rem, 0.9vw, 0.875rem)', { lineHeight: '1.4', letterSpacing: '0.03em' }],
        'label-sm': ['clamp(0.75rem, 0.8vw, 0.8125rem)', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },
      spacing: {
        'space-px': '1px',
        'space-0': '0',
        'space-1': '0.25rem',  // 4px
        'space-2': '0.5rem',   // 8px
        'space-3': '0.75rem',  // 12px
        'space-4': '1rem',     // 16px
        'space-5': '1.25rem',  // 20px
        'space-6': '1.5rem',   // 24px
        'space-7': '1.75rem',  // 28px
        'space-8': '2rem',     // 32px
        'space-9': '2.25rem',  // 36px
        'space-10': '2.5rem',  // 40px
        'space-12': '3rem',    // 48px
        'space-14': '3.5rem',  // 56px
        'space-16': '4rem',    // 64px
        'space-18': '4.5rem',  // 72px
        'space-20': '5rem',    // 80px
        'space-24': '6rem',    // 96px
        'space-28': '7rem',    // 112px
        'space-32': '8rem',    // 128px
        'space-36': '9rem',    // 144px
        'space-40': '10rem',   // 160px
        'space-44': '11rem',   // 176px
        'space-48': '12rem',   // 192px
      },
      borderRadius: {
        'radius-sm': '4px',
        'radius-md': '8px',
        'radius-lg': '12px',
        'radius-xl': '16px',
        'radius-2xl': '24px',
        'radius-full': '9999px',
      },
      boxShadow: {
        'shadow-sm': '0 1px 2px rgba(0,0,0,0.3)',
        'shadow-md': '0 4px 12px rgba(0,0,0,0.35)',
        'shadow-lg': '0 8px 32px rgba(0,0,0,0.4)',
        'shadow-xl': '0 16px 48px rgba(0,0,0,0.45)',
        'shadow-2xl': '0 24px 64px rgba(0,0,0,0.5)',
        'shadow-glow': '0 0 40px rgba(0, 229, 208, 0.15)',
        'shadow-glow-lg': '0 0 80px rgba(0, 229, 208, 0.2)',
        'shadow-gold': '0 0 40px rgba(255, 215, 94, 0.15)',
      },
      transitionDuration: {
        'duration-instant': '50ms',
        'duration-fast': '150ms',
        'duration-normal': '250ms',
        'duration-slow': '400ms',
        'duration-slower': '600ms',
        'duration-slowest': '1000ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-out-circ': 'cubic-bezier(0.08, 0.82, 0.17, 1)',
        'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'reveal': 'reveal 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)',
      },
    },
  },
  plugins: [],
}

export default config