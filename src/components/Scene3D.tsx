'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import Canvas from './SceneCanvas'
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { createParticleData } from '@/lib/particles'

interface ScrollProps {
  scrollProgress: number
}

interface SceneProps extends ScrollProps {
  mouse: { x: number; y: number }
}

// Custom shaders
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = vec4(position.xy * 0.5, 0.0, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform vec3 uCameraPosition;
  uniform float uScrollProgress;
  uniform vec3 uAccentColor;
  uniform vec3 uGoldColor;
  uniform vec2 resolution;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  // Noise functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // Sphere SDF
  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }

  // Torus SDF
  float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
  }

  // Ray marching
  float map(vec3 p) {
    float sphere = sdSphere(p, 1.0);
    float torus1 = sdTorus(p, vec2(1.6, 0.15));
    float torus2 = sdTorus(p.yzx, vec2(1.3, 0.12));
    float torus3 = sdTorus(p.zxy, vec2(1.9, 0.1));

    float d = min(sphere, min(torus1, min(torus2, torus3)));

    // Add displacement
    float disp = fbm(p.xy * 2.0 + uTime * 0.1) * 0.15;
    d += disp;

    return d;
  }

  vec3 getNormal(vec3 p) {
    float h = 0.001;
    return normalize(vec3(
      map(p + vec3(h, 0, 0)) - map(p - vec3(h, 0, 0)),
      map(p + vec3(0, h, 0)) - map(p - vec3(0, h, 0)),
      map(p + vec3(0, 0, h)) - map(p - vec3(0, 0, h))
    ));
  }

  // Soft shadow
  float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    for (int i = 0; i < 48; i++) {
      if (t >= maxt) break;
      float h = map(ro + rd * t);
      res = min(res, k * h / t);
      t += max(h, 0.01);
      if (res < 0.005) break;
    }
    return clamp(res, 0.0, 1.0);
  }

  // Fresnel
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - abs(dot(viewDir, normal)), power);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.x, resolution.y);

    // Camera setup
    vec3 ro = uCameraPosition;
    vec3 rd = normalize(vec3(uv, -1.5));

    // Rotate ray based on mouse
    float mouseX = uMouse.x * 0.3;
    float mouseY = uMouse.y * 0.3;
    mat3 rotX = mat3(1, 0, 0, 0, cos(mouseY), -sin(mouseY), 0, sin(mouseY), cos(mouseY));
    mat3 rotY = mat3(cos(mouseX), 0, sin(mouseX), 0, 1, 0, -sin(mouseX), 0, cos(mouseX));
    rd = rotX * rotY * rd;
    ro = rotX * rotY * ro;

    // Ray marching
    float t = 0.0;
    vec3 p;
    float d;
    int steps = 0;
    for (int i = 0; i < 100; i++) {
      p = ro + rd * t;
      d = map(p);
      if (d < 0.001 || t > 50.0) break;
      t += d * 0.5;
      steps++;
    }

    vec3 color = vec3(0.0);

    if (d < 0.001) {
      vec3 normal = getNormal(p);
      vec3 viewDir = normalize(-rd);

      // Lighting
      vec3 lightDir1 = normalize(vec3(1.0, 1.5, 1.0));
      vec3 lightDir2 = normalize(vec3(-0.5, 1.0, -1.0));
      vec3 lightDir3 = normalize(vec3(0.0, -1.0, 0.5));

      float diff1 = max(dot(normal, lightDir1), 0.0);
      float diff2 = max(dot(normal, lightDir2), 0.0) * 0.5;
      float diff3 = max(dot(normal, lightDir3), 0.0) * 0.3;

      // Shadows
      float shadow = softShadow(p + normal * 0.01, lightDir1, 0.01, 10.0, 32.0);
      float shadow2 = softShadow(p + normal * 0.01, lightDir2, 0.01, 10.0, 32.0);

      // Material color based on position
      float layer = sin(p.y * 3.0 + uTime * 0.5) * 0.5 + 0.5;
      vec3 baseColor = mix(vec3(0.05, 0.08, 0.12), vec3(0.02, 0.15, 0.18), layer);

      // Accent strips
      float stripe = step(0.5, fract(p.z * 2.0 + uTime * 0.2));
      baseColor = mix(baseColor, uAccentColor * 0.3, stripe * 0.3);

      // Gold accents
      float goldStripe = step(0.7, fract(p.x * 3.0 - uTime * 0.15));
      baseColor = mix(baseColor, uGoldColor * 0.4, goldStripe * 0.4);

      // Lighting
      vec3 lighting = baseColor * (diff1 * shadow + diff2 * shadow2 + diff3) * 1.5;

      // Specular
      vec3 halfDir = normalize(lightDir1 + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 64.0) * shadow;
      lighting += vec3(1.0, 0.95, 0.8) * spec * 2.0;

      // Fresnel rim
      float fres = fresnel(viewDir, normal, 3.0);
      lighting += uAccentColor * fres * 0.5;
      lighting += uGoldColor * fres * 0.3;

      // Subsurface scattering simulation
      float sss = fresnel(viewDir, normal, 1.5) * 0.3;
      lighting += uAccentColor * sss * 0.2;

      color = lighting;

      // Atmospheric glow
      float glow = fresnel(viewDir, normal, 1.0) * (1.0 - smoothstep(0.0, 2.0, t));
      color += uAccentColor * glow * 0.15;
      color += uGoldColor * glow * 0.1;
    }

    // Particles
    vec3 particlePos = ro + rd * t * 0.5;
    float particles = 0.0;
    for (int i = 0; i < 5; i++) {
      vec3 pp = particlePos * 0.5 + vec3(sin(uTime * 0.3 + float(i) * 2.0), cos(uTime * 0.2 + float(i) * 3.0), sin(uTime * 0.4 + float(i) * 5.0));
      float pn = fbm(pp.xy + uTime * 0.05);
      particles += smoothstep(0.95, 1.0, pn) * 0.5;
    }
    color += uAccentColor * particles * 0.3;
    color += uGoldColor * particles * 0.2;

    // Vignette
    float vig = 1.0 - length(uv) * 0.5;
    color *= vig;

    gl_FragColor = vec4(color, d < 0.001 ? 1.0 : 0.0);
  }
`

// Particle System
function ParticleSystem({ count = 2000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null)
  const { positions, velocities, colors } = useMemo(() => createParticleData(count, 10, 0.004), [count])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const step = Math.min(delta, 0.05) * 60
    const cosRot = Math.cos(0.002 * step)
    const sinRot = Math.sin(0.002 * step)

    for (let i = 0; i < count; i++) {
      const offset = i * 3
      const x = positions[offset]
      const z = positions[offset + 2]
      positions[offset] = x * cosRot - z * sinRot
      positions[offset + 2] = x * sinRot + z * cosRot
      positions[offset + 1] += velocities[offset + 1] * step
      if (Math.hypot(positions[offset], positions[offset + 1], positions[offset + 2]) > 6) {
        const radius = 2.5 + Math.random() * 1.5
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        positions[offset] = radius * Math.sin(phi) * Math.cos(theta)
        positions[offset + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[offset + 2] = radius * Math.cos(phi)
      }
    }
    pointsRef.current.material.size = 0.025 * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.2)
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial vertexColors transparent opacity={0.6} size={0.025} sizeAttenuation
        depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// Core Geometric Object
function CoreObject({ mouse, scrollProgress }: SceneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uCameraPosition: { value: new THREE.Vector3(0, 0, 3) },
    uScrollProgress: { value: 0 },
    uAccentColor: { value: new THREE.Color(0x00e5d0) },
    uGoldColor: { value: new THREE.Color(0xffd75e) },
    resolution: { value: new THREE.Vector2(1, 1) },
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y, 0)
      materialRef.current.uniforms.uCameraPosition.value.copy(state.camera.position)
      state.gl.getDrawingBufferSize(materialRef.current.uniforms.resolution.value)
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress
    }
  })

  return (
    <mesh
      onPointerOver={(e) => e.stopPropagation()}
      onPointerOut={(e) => e.stopPropagation()}
    >
      <planeGeometry args={[4, 4]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// Orbital Rings
function OrbitalRings() {
  const ringsRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!ringsRef.current) return

    const elapsed = state.clock.elapsedTime
    ringsRef.current.children.forEach((ring, index) => {
      const speed = (index + 1) * 0.05
      const axis = index % 3
      if (axis === 0) ring.rotation.x += speed * delta
      else if (axis === 1) ring.rotation.y += speed * delta
      else ring.rotation.z += speed * delta

      // Scale pulse
      const scale = 1 + Math.sin(elapsed * 1.5 + index) * 0.05
      ring.scale.setScalar(scale)
    })
  })

  return (
    <group ref={ringsRef}>
      {[
        { radius: 2.2, thickness: 0.02, color: 0x00e5d0, opacity: 0.15, rotation: [Math.PI / 2, 0, 0] },
        { radius: 2.8, thickness: 0.015, color: 0xffd75e, opacity: 0.1, rotation: [0, Math.PI / 3, 0] },
        { radius: 3.4, thickness: 0.01, color: 0x00e5d0, opacity: 0.08, rotation: [0, 0, Math.PI / 4] },
        { radius: 4.0, thickness: 0.008, color: 0xffd75e, opacity: 0.05, rotation: [Math.PI / 4, Math.PI / 4, 0] },
      ].map((ring, index) => (
        <mesh
          key={index}
          rotation={ring.rotation as [number, number, number]}
        >
          <torusGeometry args={[ring.radius, ring.thickness, 16, 100]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// Glow Sphere
function GlowSphere() {
  const sphereRef = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>(null)

  useFrame((state) => {
    if (!sphereRef.current) return
    const elapsed = state.clock.elapsedTime
    sphereRef.current.scale.setScalar(1 + Math.sin(elapsed * 0.5) * 0.1)
    sphereRef.current.material.opacity = 0.15 + Math.sin(elapsed * 0.7) * 0.05
  })

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshBasicMaterial
        color={0x00e5d0}
        transparent
        opacity={0.15}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

// Camera Controller
function CameraController({ scrollProgress }: ScrollProps) {
  const { camera } = useThree()

  useFrame(() => {
    const targetY = scrollProgress * 0.5
    const targetZ = 3 + scrollProgress * 1.5
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.position.z += (targetZ - camera.position.z) * 0.05
    camera.lookAt(0, targetY * 0.5, 0)
  })

  return null
}

// Post Processing
function PostProcessing({ scrollProgress }: ScrollProps) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.2 + scrollProgress * 0.5}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.025}
        mipmapBlur={true}
      />
      <Vignette
        offset={0.3}
        darkness={0.5 + scrollProgress * 0.2}
      />
      <Noise opacity={0.02} />
      <ChromaticAberration offset={new THREE.Vector2(0.0002, 0.0002)} />
    </EffectComposer>
  )
}

// Main 3D Scene
export function Scene3D({ scrollProgress = 0, mouse = { x: 0, y: 0 } }: Partial<SceneProps>) {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      camera={{ position: [0, 0, 3], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
    >
      <SceneContent scrollProgress={scrollProgress} mouse={mouse} />
    </Canvas>
  )
}

function SceneContent({ scrollProgress, mouse }: SceneProps) {

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 5, 50]} />

      {/* Lights */}
      <ambientLight intensity={0.3} color="#1a1a2e" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-3, 5, -5]}
        intensity={1}
        color="#00e5d0"
      />
      <directionalLight
        position={[0, -5, 3]}
        intensity={0.5}
        color="#ffd75e"
      />
      <pointLight position={[0, 3, 0]} intensity={2} color="#00e5d0" distance={20} decay={2} />
      <pointLight position={[0, -2, 2]} intensity={1} color="#ffd75e" distance={15} decay={2} />

      {/* Core Scene Objects */}
      <GlowSphere />
      <CoreObject
        mouse={mouse}
        scrollProgress={scrollProgress}
      />
      <OrbitalRings />
      <ParticleSystem count={1500} />

      {/* Camera Controller */}
      <CameraController scrollProgress={scrollProgress} />

      {/* Post Processing */}
      <PostProcessing scrollProgress={scrollProgress} />
    </>
  )
}

// Hero 3D Wrapper with mouse tracking
interface Hero3DProps {
  scrollProgress: number
}

export function Hero3D({ scrollProgress }: Hero3DProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      setMouse({ x: x * 0.5, y: -y * 0.5 })
    }

    const handleMouseLeave = () => {
      if (reducedMotion) return
      setMouse({ x: 0, y: 0 })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [reducedMotion])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      aria-hidden="true"
    >
      <Scene3D scrollProgress={scrollProgress} mouse={mouse} />
      {/* Fallback for no WebGL */}
      <noscript>
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 mx-auto text-border"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="10,10" />
              <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.3" />
            </svg>
            <p className="mt-6 text-body-lg text-foregroundMuted font-display">
              AETHER — Reality, Redesigned
            </p>
          </div>
        </div>
      </noscript>
    </div>
  )
}
