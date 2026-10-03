'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useFrame, useThree } from '@react-three/fiber'
import Canvas from './SceneCanvas'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'
import { createParticleData } from '@/lib/particles'

const showcaseFeatures = [
  {
    title: 'Zero-Latency Rendering',
    description: 'Edge-deployed GPU clusters deliver 90fps stereoscopic rendering with sub-20ms motion-to-photon latency globally.',
    metric: '<20ms',
    metricLabel: 'Latency',
  },
  {
    title: 'Persistent Worlds',
    description: 'State synchronization across devices and sessions. Your spaces exist continuously, evolving even when you\'re away.',
    metric: '∞',
    metricLabel: 'Persistence',
  },
  {
    title: 'Neural Interfaces',
    description: 'Brain-computer integration for thought-driven navigation. Patented non-invasive neural decoding at consumer scale.',
    metric: '94%',
    metricLabel: 'Accuracy',
  },
]

// Hero 3D Object for Showcase
function ShowcaseObject() {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const shellRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { positions, velocities, colors } = useMemo(() => createParticleData(1000, 6, 0.01), [])

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime

    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y += delta * 0.05
      groupRef.current.rotation.x = Math.sin(elapsed * 0.3) * 0.1
    }

    if (coreRef.current) {
      // Core pulse
      const pulse = 1 + Math.sin(elapsed * 1.5) * 0.08
      coreRef.current.scale.setScalar(pulse)

      // Material animation
      if (coreRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        coreRef.current.material.transmission = 0.8 + Math.sin(elapsed * 2) * 0.1
        coreRef.current.material.thickness = 2 + Math.sin(elapsed * 1.7) * 0.5
      }
    }

    if (shellRef.current) {
      // Counter-rotation
      shellRef.current.rotation.y -= delta * 0.03
      shellRef.current.rotation.x += delta * 0.02

      // Shell pulse
      const shellPulse = 1 + Math.sin(elapsed * 1.2 + 1) * 0.05
      shellRef.current.scale.setScalar(shellPulse)

      if (shellRef.current.material instanceof THREE.MeshPhysicalMaterial) {
        shellRef.current.material.opacity = 0.15 + Math.sin(elapsed * 1.8) * 0.05
      }
    }

    // Particles
    if (particlesRef.current && particlesRef.current.geometry && particlesRef.current.geometry.attributes.position) {
      const positionsAttr = particlesRef.current.geometry.attributes.position
      const velocityAttr = particlesRef.current.geometry.attributes.velocity
      if (!positionsAttr || !velocityAttr) return

      const positions = positionsAttr.array
      const velocities = velocityAttr.array
      if (!positions || !velocities) return
      const count = positions.length / 3

      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocities[i * 3] * delta * 60
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60

        // Orbital motion
        const radius = Math.sqrt(
          positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2
        )

        if (radius > 4) {
          // Reset to spherical shell
          const newRadius = 2 + Math.random() * 2
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          positions[i * 3] = newRadius * Math.sin(phi) * Math.cos(theta)
          positions[i * 3 + 1] = newRadius * Math.sin(phi) * Math.sin(theta)
          positions[i * 3 + 2] = newRadius * Math.cos(phi)
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer glow shells */}
      <mesh
        ref={shellRef}
        scale={2.5}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#00e5d0"
          metalness={0}
          roughness={0}
          transmission={0.9}
          thickness={1}
          ior={1.33}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Middle shell - gold */}
      <mesh
        scale={1.8}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffd75e"
          metalness={0.2}
          roughness={0.1}
          transmission={0.7}
          thickness={0.5}
          ior={1.5}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core object */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhysicalMaterial
          color="#0a0a0f"
          metalness={0.9}
          roughness={0.05}
          transmission={0.8}
          thickness={2}
          ior={2.0}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={3}
          flatShading
        />
      </mesh>

      {/* Inner core glow */}
      <mesh scale={0.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00e5d0"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-velocity" args={[velocities, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.8}
          size={0.025}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Orbital rings */}
      <group>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            rotation={[Math.PI / 2, 0, i * Math.PI / 3]}
            scale={3 + i * 0.5}
          >
            <torusGeometry args={[1, 0.015, 8, 100]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#00e5d0' : '#ffd75e'}
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function ShowcaseScene({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()

  useFrame(() => {
    // Cinematic camera movement based on scroll
    camera.position.y = scrollProgress * 0.5
    camera.position.z = 5 + scrollProgress * 2
    camera.lookAt(0, scrollProgress * 0.3, 0)
  })

  return (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[8, 15, 10]}
        intensity={4}
        color="#ffffff"
        castShadow
      >
        <orthographicCamera
          attach="shadow.camera"
          args={[-10, 10, 10, -10, 0, 50]}
        />
      </directionalLight>
      <directionalLight position={[-5, 8, -8]} intensity={2} color="#00e5d0" />
      <directionalLight position={[0, -5, 5]} intensity={1.5} color="#ffd75e" />
      <pointLight position={[0, 4, 0]} intensity={3} color="#00e5d0" distance={20} decay={2} />
      <pointLight position={[0, -3, 3]} intensity={2} color="#ffd75e" distance={15} decay={2} />

      <ShowcaseObject />
    </>
  )
}

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const progress = 1 - rect.bottom / (viewportHeight + rect.height)
      setScrollProgress(Math.max(0, Math.min(1, progress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="section relative overflow-hidden"
      aria-labelledby="showcase-heading"
    >
      {/* Deep background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #00e5d00d 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, #ffd75e08 0%, transparent 40%), #0a0a0f',
        }}
        aria-hidden="true"
      />

      {/* Grid floor reflection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[300px] opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `perspective(500px) rotateX(60deg) translateY(-100px) scale(${1 + scrollProgress * 0.2})`,
          transformOrigin: 'bottom center',
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 3D Visualization - Left on desktop */}
          <motion.div
            className="relative min-w-0 lg:sticky lg:top-24 order-2 lg:order-1"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative aspect-[4/3] max-w-xl xl:max-w-2xl mx-auto">
              <Canvas
                className="absolute inset-0 rounded-radius-2xl overflow-hidden"
                camera={{ position: [0, 0, 5], fov: 40 }}
                gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
                style={{ touchAction: 'none' }}
              >
                <color attach="background" args={['#0a0a0f']} />
                <ShowcaseScene scrollProgress={scrollProgress} />
                <EffectComposer multisampling={0}>
                  <Bloom intensity={1.5} luminanceThreshold={0.7} mipmapBlur={true} />
                  <Vignette offset={0.4} darkness={0.6} />
                  <Noise opacity={0.015} />
                </EffectComposer>
              </Canvas>

              {/* Corner accents */}
              <div className="absolute -inset-4 border border-borderSubtle/50 rounded-radius-2xl pointer-events-none" aria-hidden="true">
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-accent/50" aria-hidden="true" />
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gold/50" aria-hidden="true" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-accent/50" aria-hidden="true" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-gold/50" aria-hidden="true" />
              </div>
            </div>
          </motion.div>

          {/* Content - Right on desktop */}
          <motion.div
            className="min-w-0 order-1 lg:order-2 lg:pr-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <p className="text-label-md font-medium text-accent tracking-widest uppercase mb-4">
              Technical Showcase
            </p>
            <h2
              id="showcase-heading"
              className="font-display font-semibold text-display-md md:text-display-lg tracking-tight text-foreground mb-8"
              style={{ textWrap: 'balance' }}
            >
              Engineered for the <span className="text-gradient">impossible</span>
            </h2>
            <p className="text-body-lg text-foregroundMuted mb-12 leading-relaxed max-w-[500px]">
              AETHER&apos;s architecture redefines what&apos;s possible in spatial computing.
              Every component built from first principles for performance at scale.
            </p>

            {/* Feature cards */}
            <div className="space-y-6">
              {showcaseFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group relative p-6 md:p-8 bg-surface/60 backdrop-blur-xl border border-borderSubtle rounded-radius-xl hover:border-accent/30 hover:shadow-xl transition-all duration-normal"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.15, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-4">
                    <div className="min-w-0 flex-1 sm:pr-6">
                      <h3 className="font-display font-semibold text-heading-lg text-foreground mb-3 group-hover:text-accent transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-body-md text-foregroundMuted leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end text-right shrink-0">
                      <span className="font-display font-bold text-display-sm text-accent">
                        {feature.metric}
                      </span>
                      <span className="text-label-sm text-foregroundSubtle uppercase tracking-wider mt-1">
                        {feature.metricLabel}
                      </span>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent relative overflow-hidden" aria-hidden="true">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-gold"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.15, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
