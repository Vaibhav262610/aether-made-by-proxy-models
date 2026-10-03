'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ScrollContextType {
  scrollProgress: number
  scrollY: number
  viewportHeight: number
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [scroll, setScroll] = useState<ScrollContextType>({
    scrollProgress: 0,
    scrollY: 0,
    viewportHeight: 1000,
  })

  useEffect(() => {
    let frameId = 0
    const update = () => {
      frameId = 0
      const viewportHeight = window.innerHeight
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight)
      setScroll({
        scrollY: window.scrollY,
        viewportHeight,
        scrollProgress: maxScroll > 0 ? Math.max(0, Math.min(window.scrollY / maxScroll, 1)) : 0,
      })
    }
    const scheduleUpdate = () => {
      if (!frameId) frameId = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(document.body)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    update()

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return <ScrollContext.Provider value={scroll}>{children}</ScrollContext.Provider>
}

export function useScroll() {
  const context = useContext(ScrollContext)
  if (!context) throw new Error('useScroll must be used within a ScrollProvider')
  return context
}
