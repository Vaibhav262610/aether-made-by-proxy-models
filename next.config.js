/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three', 'gsap', 'lenis'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig