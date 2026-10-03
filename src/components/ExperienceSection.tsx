'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFrame, useThree } from '@react-three/fiber'
import Canvas from './SceneCanvas'
import * as THREE from 'three'

const experiences = [
  {
    id: 'spatial-ui',
    number: '01',
    title: 'Spatial Interface',
    description: 'Design interfaces that exist in three dimensions. Objects respond to depth, light, and spatial relationships naturally.',
    color: '#00e5d0',
    secondaryColor: '#00b8a8',
  },
  {
    id: 'gesture-control',
    number: '02',
    title: 'Gesture Intelligence',
    description: 'Natural interaction without controllers. Hand tracking, eye tracking, and voice merge into a unified input system.',
    color: '#ffd75e',
    secondaryColor: '#e6bf4a',
  },
  {
    id: 'ambient-compute',
    number: '03',
    title: 'Ambient Computing',
    description: 'Technology that disappears. Context-aware surfaces adapt to your workflow, presenting information when and where you need it.',
    color: '#00e5d0',
    secondaryColor: '#00b8a8',
  },
  {
    id: 'collaborative',
    number: '04',
    title: 'Shared Presence',
    description: 'Real-time collaboration across any distance. Avatars with micro-expressions, spatial audio, and shared persistent worlds.',
    color: '#ff6b9d',
    secondaryColor: '#e8558a',
  },
]

// Floating geometric shape for each experience
function ExperienceShape({ index, color, active }: { index: number; color: string; active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const elapsed = state.clock.elapsedTime

    // Base rotation
    meshRef.current.rotation.y += delta * 0.15 * (index % 2 === 0 ? 1 : -1)
    meshRef.current.rotation.x += delta * 0.08

    // Active state modifications
    if (active || hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(0.92, 0.92, 0.92), delta * 8)
      meshRef.current.rotation.y += delta * 0.5
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(0.8, 0.8, 0.8), delta * 8)
    }

    // Float
    meshRef.current.position.y = Math.sin(elapsed * 0.7 + index * 2) * 0.15

    // Material pulse
    if (meshRef.current.material instanceof THREE.MeshPhysicalMaterial) {
      meshRef.current.material.opacity = 0.3 + (active || hovered ? 0.3 : 0) + Math.sin(elapsed * 2) * 0.05
      meshRef.current.material.transmission = 0.5 + (active || hovered ? 0.3 : 0)
      meshRef.current.material.ior = 1.5 + (active || hovered ? 0.5 : 0)
    }
  })

  const geometry = index === 0
    ? <octahedronGeometry args={[1, 0]} />
    : index === 1
    ? <icosahedronGeometry args={[1, 0]} />
    : index === 2
    ? <torusKnotGeometry args={[0.7, 0.2, 100, 16]} />
    : <dodecahedronGeometry args={[1, 0]} />

  return (
    <mesh
      ref={meshRef}
      position={[-2.5 + index * 1.66, 0, -2]}
      scale={0.8}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {geometry}
      <meshPhysicalMaterial
        color={color}
        metalness={0.3}
        roughness={0.1}
        transmission={0.5}
        thickness={1.5}
        ior={1.5}
        transparent
        opacity={0.3}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={2}
      />
    </mesh>
  )
}

// Interactive 3D Scene for Experience Section
function ExperienceScene({ activeIndex, scrollProgress }: { activeIndex: number; scrollProgress: number }) {
  const { camera } = useThree()

  useFrame(() => {
    // Subtle camera movement based on scroll
    camera.position.x = scrollProgress * 0.5
    camera.position.y = Math.sin(scrollProgress * Math.PI * 2) * 0.3
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[5, 10, 7]} intensity={3} color="#ffffff" castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#00e5d0" />
      <pointLight position={[0, 3, 0]} intensity={2} color="#00e5d0" distance={10} decay={2} />
      <pointLight position={[0, -2, 2]} intensity={1} color="#ffd75e" distance={10} decay={2} />

      {experiences.map((exp, index) => (
        <ExperienceShape
          key={exp.id}
          index={index}
          color={exp.color}
          active={activeIndex === index}
        />
      ))}
    </>
  )
}

export default function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-rotate through experiences
  useEffect(() => {
    if (!mounted || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % experiences.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [mounted])

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section relative overflow-hidden"
      aria-labelledby="experience-heading"
    >
      {/* Background gradient shift */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${experiences[activeIndex].color}15, transparent 60%), radial-gradient(ellipse at 50% 100%, ${experiences[activeIndex].secondaryColor}10, transparent 50%)`,
          transition: 'background 0.8s ease-out',
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
            Core Capabilities
          </p>
          <h2
            id="experience-heading"
            className="font-display font-semibold text-display-md md:text-display-lg tracking-tight text-foreground"
            style={{ textWrap: 'balance' }}
          >
            Four pillars of <span className="text-gradient">spatial computing</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* 3D Visualization Column */}
          <div className="relative lg:sticky lg:top-24">
            <div className="relative aspect-square max-w-xl mx-auto">
              <Canvas
                className="absolute inset-0"
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
                style={{ touchAction: 'none' }}
              >
                <ExperienceScene activeIndex={activeIndex} scrollProgress={0} />
              </Canvas>

              {/* Active indicator rings */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-hidden="true"
              >
                <motion.div
                  className="absolute inset-0 rounded-full border border-accent/30"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-gold/20"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              </div>
            </div>

            {/* Experience Indicators */}
            <motion.div
              className="flex items-center justify-center gap-3 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            >
              {experiences.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-normal ${
                    activeIndex === index
                      ? 'bg-accent w-8 shadow-glow'
                      : 'bg-border hover:bg-accent/50'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View ${experiences[index].title}`}
                  aria-current={activeIndex === index ? 'true' : 'false'}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          </div>

          {/* Content Column */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="pr-8 lg:pr-16"
              >
                {/* Number */}
                <motion.div
                  className="inline-flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <span
                    className="font-display font-bold text-display-md text-accent/20"
                    style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}
                  >
                    {experiences[activeIndex].number}
                  </span>
                  <motion.div
                    className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                    style={{ transformOrigin: 'top' }}
                  />
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="font-display font-semibold text-display-sm md:text-display-md tracking-tight text-foreground mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {experiences[activeIndex].title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className="text-body-lg text-foregroundMuted mb-8 leading-relaxed max-w-[500px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {experiences[activeIndex].description}
                </motion.p>

                {/* Feature highlights */}
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {[
                    'Real-time rendering',
                    'Physics simulation',
                    'Spatial audio',
                    'Persistent state',
                  ].slice(0, 2 + activeIndex).map((feature, i) => (
                    <motion.span
                      key={feature}
                      className="chip"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    >
                      {feature}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
