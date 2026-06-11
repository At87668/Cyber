'use client'

import { useEffect, useRef } from 'react'

/**
 * Full-screen CRT scanline / flicker overlay.
 * Pure CSS, no JS required.
 */
export const CyberCRT = () => <div className="cyber-crt" aria-hidden="true" />

/**
 * Custom cyberpunk cursor that follows the mouse, scales on interactive
 * elements and shrinks when dragging inside the Galaxy section.
 * Hidden on touch devices via CSS.
 */
export const CyberCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth <= 768) return

    const cursor = cursorRef.current
    if (!cursor) return

    const handleMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      cursor.classList.toggle(
        'cyber-cursor--hover',
        !!target.closest('a, button, [data-interactive], input, textarea'),
      )
    }
    const handleLeave = () => {
      cursor.classList.remove('cyber-cursor--drag')
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return <div ref={cursorRef} className="cyber-cursor" aria-hidden="true" />
}

/**
 * Interactive particle network background. Connects nearby particles
 * with thin lines, plus extra "force lines" to the mouse cursor.
 */
export const CyberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let particles: Particle[] = []

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.6
        this.vy = (Math.random() - 0.5) * 0.6
        this.size = Math.random() * 2 + 1
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
      }
      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      const count = Math.max(40, Math.floor((width * height) / 18000))
      particles = []
      for (let i = 0; i < count; i++) particles.push(new Particle())
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    const onLeave = () => {
      mouseRef.current.x = null
      mouseRef.current.y = null
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.update()
        p.draw()

        // particle-to-particle connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.hypot(dx, dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(120,120,150,${0.18 - dist / 800})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }

        // particle-to-mouse force lines
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        if (mx != null && my != null) {
          const dx = p.x - mx
          const dy = p.y - my
          const dist = Math.hypot(dx, dy)
          if (dist < 160) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.45 - dist / 400})`
            ctx.lineWidth = 0.8
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mx, my)
            ctx.stroke()

            // mild pull towards the cursor
            const force = (160 - dist) / 160
            p.x -= (dx / dist) * force * 0.4
            p.y -= (dy / dist) * force * 0.4
          }
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="cyber-bg-canvas" aria-hidden="true" />
  )
}
