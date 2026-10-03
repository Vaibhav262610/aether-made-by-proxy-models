'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import Canvas from './SceneCanvas'
import * as THREE from 'three'

const features = [
  {
    id: 'rendering',
    icon: 'cube',
    title: 'Adaptive Rendering',
    description: 'Dynamic foveated rendering adjusts quality per-pupil in real-time. 10x performance gains without perceptual loss.',
    accent: '#00e5d0',
  },
  {
    id: 'physics',
    icon: 'sphere',
    title: 'Physical Simulation',
    description: 'Unified physics engine handles rigid bodies, soft bodies, fluids, and cloth at 120Hz. Deterministic across all clients.',
    accent: '#ffd75e',
  },
  {
    id: 'audio',
    icon: 'waves',
    title: 'Spatial Audio',
    description: 'HRTF-based binaural rendering with real-time occlusion, diffraction, and room acoustics simulation.',
    accent: '#00e5d0',
  },
  {
    id: 'networking',
    icon: 'network',
    title: 'Deterministic Sync',
    description: 'CRDT-based state synchronization with predictive rollback. Sub-millisecond consensus across global edge nodes.',
    accent: '#ff6b9d',
  },
  {
    id: 'ai',
    icon: 'brain',
    title: 'Generative Worlds',
    description: 'On-device diffusion models generate assets, layouts, and narratives in real-time. Infinite content from finite prompts.',
    accent: '#00e5d0',
  },
  {
    id: 'haptics',
    icon: 'touch',
    title: 'Haptic Feedback',
    description: 'Ultrasonic mid-air haptics create tactile sensations without wearables. 16kHz phased arrays with 2mm resolution.',
    accent: '#ffd75e',
  },
]

// Icon components
function FeatureIcon({ type, color, size = 24 }: { type: string; color: string; size?: number }) {
  const strokeWidth = 1.5

  switch (type) {
    case 'cube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79V9a2 2 0 0 0-2-2h-5l-4-4-4 4H5a2 2 0 0 0-2 2v5.79" />
          <path d="M3 16.21V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3.79" />
          <path d="M12 4v6" />
          <path d="M10 6h4" />
        </svg>
      )
    case 'sphere':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 0 20" />
          <path d="M2 12a10 10 0 0 1 20 0" />
        </svg>
      )
    case 'waves':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12c3-3 7-3 10 0s7 3 10 0" />
          <path d="M2 18c3-3 7-3 10 0s7 3 10 0" />
          <path d="M2 6c3 3 7 3 10 0s7-3 10 0" />
        </svg>
      )
    case 'network':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <circle cx="4" cy="4" r="3" />
          <circle cx="20" cy="4" r="3" />
          <circle cx="4" cy="20" r="3" />
          <circle cx="20" cy="20" r="3" />
          <path d="M7 7h10v10H7z" />
        </svg>
      )
    case 'brain':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.5 3-1.34 4.04A4 4 0 0 1 12 18c-1.5 0-3-.5-4.04-1.34A4 4 0 0 1 8 10c0-1.5.5-3 1.34-4.04A4 4 0 0 1 12 2z" />
          <path d="M8 10c0-1.5.5-3 1.34-4.04A4 4 0 0 1 12 2" />
          <path d="M16 10c0-1.5-.5-3-1.34-4.04A4 4 0 0 0 12 2" />
        </svg>
      )
    case 'touch':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a10 10 0 0 1 10 10c0 1.5-.3 3-.8 4.2" />
          <path d="M5 12a5 5 0 0 0 7 4" />
          <path d="M12 17v4" />
          <path d="M10 19h4" />
          <path d="M19 12a10 10 0 0 0-10-10" />
        </svg>
      )
    default:
      return null
  }
}

// 3D Feature Card Background
function FeatureCard3D({ accent, index }: { accent: string; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const elapsed = state.clock.elapsedTime

    meshRef.current.rotation.y += delta * 0.05 * (index % 2 === 0 ? 1 : -1)
    meshRef.current.rotation.x = Math.sin(elapsed * 0.5 + index) * 0.1

    if (meshRef.current.material instanceof THREE.MeshPhysicalMaterial) {
      meshRef.current.material.opacity = 0.1 + Math.sin(elapsed * 1.5 + index) * 0.03
      meshRef.current.material.transmission = 0.3 + Math.sin(elapsed * 1.2 + index) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -0.5]} scale={1.2}>
      <boxGeometry args={[2.2, 2.2, 0.5]} />
      <meshPhysicalMaterial
        color={accent}
        metalness={0.5}
        roughness={0.1}
        transmission={0.3}
        thickness={0.5}
        ior={1.5}
        transparent
        opacity={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={2}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 3], fov: 25, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          style={{ touchAction: 'none' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 4, 3]} intensity={2} />
          <FeatureCard3D accent={feature.accent} index={index} />
        </Canvas>
      </div>

      {/* Card Content */}
      <div className="card-base relative h-full p-8 md:p-10">
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-normal"
          style={{ backgroundColor: feature.accent }}
          aria-hidden="true"
        />

        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-radius-xl flex items-center justify-center mb-6"
          style={{
            background: `linear-gradient(135deg, ${feature.accent}20, ${feature.accent}10)`,
            border: `1px solid ${feature.accent}30`,
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
          whileHover={{ scale: 1.1, rotate: 180 }}
        >
          <FeatureIcon type={feature.icon} color={feature.accent} size={28} />
        </motion.div>

        {/* Title */}
        <h3 className="font-display font-semibold text-heading-lg text-foreground mb-4">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-body-md text-foregroundMuted leading-relaxed mb-6">
          {feature.description}
        </p>

        {/* Link */}
        <motion.button
          className="btn-ghost w-full justify-start gap-2"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Learn more about ${feature.title}`}
        >
          <span className="font-medium">Explore</span>
          <motion.svg
            className="w-4 h-4 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </motion.svg>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="section relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-label-md font-medium text-accent tracking-widest uppercase mb-4">
            Feature Deep Dive
          </p>
          <h2
            id="features-heading"
            className="font-display font-semibold text-display-md md:text-display-lg tracking-tight text-foreground"
            style={{ textWrap: 'balance' }}
          >
            Six technologies powering <span className="text-gradient">the platform</span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
