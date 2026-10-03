'use client'

import { useEffect } from 'react'
import { ScrollProvider, useScroll } from '@/components/ScrollProvider'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TrustSection from '@/components/TrustSection'
import ExperienceSection from '@/components/ExperienceSection'
import ShowcaseSection from '@/components/ShowcaseSection'
import FeaturesSection from '@/components/FeaturesSection'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Inner component that uses scroll context
function PageContent() {
  const { scrollProgress } = useScroll()

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative">
        <Hero scrollProgress={scrollProgress} />
        <TrustSection />
        <ExperienceSection />
        <ShowcaseSection />
        <FeaturesSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}

export default function HomePage() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -80 },
    })

    let frameId: number
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return (
    <ScrollProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        <PageContent />
      </div>
    </ScrollProvider>
  )
}
