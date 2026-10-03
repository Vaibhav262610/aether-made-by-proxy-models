'use client'

import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useFrame, useThree } from '@react-three/fiber'
import Canvas from './SceneCanvas'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'
import { createParticleData } from '@/lib/particles'
import Link from 'next/link'

// CTA 3D Scene
function CTAScene() {
  const { camera } = useThree()
  const particlesRef = useRef<THREE.Points>(null)
  const { positions, velocities, colors } = useMemo(() => createParticleData(2000, 12, 0.006), [])

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime

    // Camera slow movement
    camera.position.x = Math.sin(elapsed * 0.08) * 0.5
    camera.position.y = Math.cos(elapsed * 0.06) * 0.3
    camera.lookAt(0, 0, 0)

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

        const radius = Math.sqrt(
          positions[i * 3] ** 2 +
          positions[i * 3 + 1] ** 2 +
          positions[i * 3 + 2] ** 2
        )

        if (radius > 8) {
          const newRadius = 3 + Math.random() * 3
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
    <>
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-3, 5, -5]} intensity={1} color="#00e5d0" />
      <pointLight position={[0, 3, 0]} intensity={2} color="#00e5d0" distance={20} decay={2} />
      <pointLight position={[0, -2, 2]} intensity={1} color="#ffd75e" distance={15} decay={2} />

      {/* Central geometric form */}
      <group>
        <mesh
          rotation={[0.3, 0.5, 0]}
          scale={1.5}
        >
          <octahedronGeometry args={[1, 2]} />
          <meshPhysicalMaterial
            color="#0a0a0f"
            metalness={0.9}
            roughness={0.02}
            transmission={0.9}
            thickness={3}
            ior={2.2}
            clearcoat={1}
            clearcoatRoughness={0.02}
            envMapIntensity={3}
            flatShading
          />
        </mesh>

        {/* Inner glow */}
        <mesh scale={0.7}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#00e5d0"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Rotating wireframe */}
        <mesh
          rotation={[0, 0, 0]}
          scale={2.2}
        >
          <octahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#00e5d0"
            wireframe
            transparent
            opacity={0.1}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Particle atmosphere */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-velocity" args={[velocities, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.6}
          size={0.025}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient rings */}
      <group>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            rotation={[Math.PI / 2, 0, i * Math.PI / 4]}
            scale={4 + i * 0.8}
          >
            <torusGeometry args={[1, 0.008, 8, 64]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#00e5d0' : '#ffd75e'}
              transparent
              opacity={0.05}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </>
  )
}

export default function FinalCTA() {

  return (
    <section
      id="contact"
      className="section relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Deep background with radial gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 20%, #00e5d015 0%, transparent 50%),
            radial-gradient(ellipse at 30% 80%, #ffd75e10 0%, transparent 40%),
            radial-gradient(ellipse at 70% 60%, #ff6b9d08 0%, transparent 30%),
            #0a0a0f
          `,
        }}
        aria-hidden="true"
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02] noise-overlay" aria-hidden="true" />

      {/* 3D Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 6], fov: 35 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          style={{ touchAction: 'none' }}
        >
          <color attach="background" args={['#0a0a0f']} />
          <CTAScene />
          <EffectComposer multisampling={0}>
            <Bloom intensity={1.8} luminanceThreshold={0.6} mipmapBlur={true} />
            <Vignette offset={0.5} darkness={0.7} />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="container-main relative z-10">
        <div className="max-w-[800px] mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-radius-full bg-surface/80 backdrop-blur-xl border border-borderSubtle mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-label-md font-medium text-accent tracking-wider uppercase">
              Ready to begin
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="cta-heading"
            className="font-display font-semibold text-display-lg md:text-display-xl lg:text-display-xl tracking-tight text-foreground mb-8"
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{ textWrap: 'balance' }}
          >
            Build what&apos;s <span className="text-gradient">next.</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            className="text-body-lg md:text-body-lg text-foregroundMuted max-w-[550px] mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            Join thousands of developers shaping the future of spatial computing.
            Early access opens this quarter.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <Link
              href="#signup"
              className="btn-primary group px-10 py-4 text-label-lg"
              aria-label="Request early access to AETHER"
            >
              <span>Request Early Access</span>
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
              className="btn-secondary px-10 py-4 text-label-lg"
              aria-label="Watch live demo of AETHER"
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

          {/* Trust indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-16 pt-12 border-t border-borderSubtle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2 text-foregroundSubtle">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-label-md font-medium">SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2 text-foregroundSubtle">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-label-md font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-foregroundSubtle">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-label-md font-medium">99.99% Uptime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
