'use client'

import { Canvas, type CanvasProps } from '@react-three/fiber'
import { Component, type ReactNode, useEffect, useRef, useState } from 'react'

let webGLAvailable: boolean | undefined

function supportsWebGL() {
  if (webGLAvailable === undefined) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    webGLAvailable = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  }
  return webGLAvailable
}

function StaticScene() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-radial from-accent/10 to-transparent" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="w-3/4 h-3/4 max-w-lg text-accent/30" fill="none">
        <circle cx="100" cy="100" r="70" stroke="currentColor" />
        <ellipse cx="100" cy="100" rx="90" ry="35" stroke="currentColor" transform="rotate(-30 100 100)" />
        <ellipse cx="100" cy="100" rx="90" ry="35" stroke="#ffd75e" strokeOpacity="0.3" transform="rotate(30 100 100)" />
        <circle cx="100" cy="100" r="35" fill="currentColor" fillOpacity="0.15" />
      </svg>
    </div>
  )
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? <StaticScene /> : this.props.children
  }
}

export default function SceneCanvas({ children, className, style, ...props }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [supported, setSupported] = useState(false)
  const [activated, setActivated] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setSupported(supportsWebGL())
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(media.matches)
    updateMotion()
    media.addEventListener('change', updateMotion)
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting) setActivated(true)
    }, { rootMargin: '100px' })
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      media.removeEventListener('change', updateMotion)
    }
  }, [])

  return (
    <div ref={containerRef} className={`w-full h-full ${className || ''}`} style={{ ...style, touchAction: 'pan-y' }}>
      {supported && activated ? (
        <SceneErrorBoundary>
          <Canvas {...props} dpr={[1, 1.5]} frameloop={visible && !reducedMotion ? 'always' : 'demand'} style={{ touchAction: 'pan-y' }}>
            {children}
          </Canvas>
        </SceneErrorBoundary>
      ) : <StaticScene />}
    </div>
  )
}
