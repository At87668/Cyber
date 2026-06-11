'use client'

import { useEffect, useRef } from 'react'

export interface GalaxyItem {
  /** Unique key. */
  id: string
  /** Header text shown in the card. */
  title: string
  /** Short description. */
  body: string
  /** Color theme of the card. */
  variant?: 'web' | 'console' | 'miner' | 'light'
  /** Meta line shown in the footer (left side). */
  tag?: string
  /** Meta line shown in the footer (right side). */
  meta?: string
  /** Optional URL the card opens on click. */
  url?: string
}

interface GalaxyProps {
  items: GalaxyItem[]
  /** Optional section title rendered above the carousel. */
  title?: string
  /** Optional hint rendered below the carousel. */
  hint?: string
  className?: string
}

function escape(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * 3D rotating carousel of cards. The user can drag horizontally to
 * rotate the carousel, and hovering a card pulls it forward.
 * Falls back to auto-rotation when idle.
 */
export const Galaxy = ({
  items,
  title = '// PROJECT_GALAXY',
  hint = '[ DRAG TO ROTATE SYSTEM ]',
  className,
}: GalaxyProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const linesRef = useRef<HTMLDivElement | null>(null)
  const stateRef = useRef<{
    rotation: number
    velocity: number
    isDragging: boolean
    lastX: number
    targetZoom: number
    currentZoom: number
    activeIndex: number
  }>({
    rotation: 0,
    velocity: 0.2,
    isDragging: false,
    lastX: 0,
    targetZoom: -900,
    currentZoom: -900,
    activeIndex: -1,
  })

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const CONFIG = {
      radius: isMobile ? 240 : 450,
      starIndent: 40,
      baseZoom: isMobile ? -600 : -900,
      activeZoom: isMobile ? -400 : -600,
      autoSpeed: 0.2,
      dragFactor: 0.4,
    }

    const carousel = carouselRef.current
    const stage = stageRef.current
    const linesContainer = linesRef.current
    const section = sectionRef.current
    if (!carousel || !stage || !linesContainer || !section) return

    // Mix data items with star-node spacers
    const wrappers: HTMLElement[] = []
    items.forEach((item) => {
      const card = document.createElement('div')
      card.className = `cyber-galaxy__card cyber-galaxy__card--${item.variant ?? 'web'}`
      if (item.url) card.dataset.url = item.url
      card.innerHTML = `
        <div class="cyber-galaxy__card-glass"></div>
        <div class="cyber-galaxy__card-inner">
          <div class="cyber-galaxy__card-header">${escape(item.title)}</div>
          <div class="cyber-galaxy__card-body">${escape(item.body)}</div>
          <div class="cyber-galaxy__card-meta">
            <span>${escape(item.tag ?? '')}</span>
            <span>${escape(item.meta ?? '')}</span>
          </div>
        </div>
      `
      wrappers.push(card)

      const star = document.createElement('div')
      star.className = 'cyber-galaxy__star'
      star.innerHTML = '<div class="cyber-galaxy__star-core"></div>'
      wrappers.push(star)
    })

    wrappers.forEach((el) => carousel.append(el))

    const total = wrappers.length
    const anglePerItem = 360 / total

    // A. Layout
    wrappers.forEach((el, i) => {
      const isStar = el.classList.contains('cyber-galaxy__star')
      const r = isStar ? CONFIG.radius - CONFIG.starIndent : CONFIG.radius
      const angle = i * anglePerItem
      el.dataset.angle = String(angle)
      const t = `rotateY(${angle}deg) translateZ(${r}px)`
      el.dataset.baseTransform = t
      el.style.transform = t
    })

    // B. Beam lines
    linesContainer.innerHTML = ''
    for (let i = 0; i < total; i++) {
      const curr = wrappers[i]
      const next = wrappers[(i + 1) % total]
      const r1 = curr.classList.contains('cyber-galaxy__star')
        ? CONFIG.radius - CONFIG.starIndent
        : CONFIG.radius
      const r2 = next.classList.contains('cyber-galaxy__star')
        ? CONFIG.radius - CONFIG.starIndent
        : CONFIG.radius
      const a1 = i * anglePerItem * (Math.PI / 180)
      const a2 = (i + 1) * anglePerItem * (Math.PI / 180)
      const x1 = r1 * Math.sin(a1)
      const z1 = r1 * Math.cos(a1)
      const x2 = r2 * Math.sin(a2)
      const z2 = r2 * Math.cos(a2)
      const dist = Math.hypot(x2 - x1, z2 - z1)
      const dx = x2 - x1
      const dz = z2 - z1
      const yaw = (Math.atan2(dx, dz) * 180) / Math.PI
      const line = document.createElement('div')
      line.className = 'cyber-galaxy__beam'
      line.style.width = `${dist}px`
      line.style.transform = `translate3d(${x1}px, 0, ${z1}px) rotateY(${yaw - 90}deg)`
      linesContainer.append(line)
    }

    // C. Interaction
    const setDragging = (v: boolean) => {
      stateRef.current.isDragging = v
      const cursor = document.querySelector<HTMLElement>('.cyber-cursor')
      if (cursor) cursor.classList.toggle('cyber-cursor--drag', v)
    }
    const handleStart = (x: number) => {
      setDragging(true)
      stateRef.current.lastX = x
      stateRef.current.velocity = 0
    }
    const handleMove = (x: number) => {
      if (!stateRef.current.isDragging) return
      const d = x - stateRef.current.lastX
      stateRef.current.rotation += d * CONFIG.dragFactor
      stateRef.current.velocity = d * CONFIG.dragFactor
      stateRef.current.lastX = x
    }
    const handleEnd = () => setDragging(false)

    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX)
    const onMouseMove = (e: MouseEvent) => {
      if (stateRef.current.isDragging) {
        e.preventDefault()
        handleMove(e.clientX)
      }
    }
    const onMouseUp = handleEnd
    const onTouchStart = (e: TouchEvent) =>
      handleStart(e.touches[0]?.clientX ?? 0)
    const onTouchMove = (e: TouchEvent) => {
      if (stateRef.current.isDragging) {
        handleMove(e.touches[0]?.clientX ?? 0)
      }
    }
    const onTouchEnd = handleEnd

    section.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    section.addEventListener('touchstart', onTouchStart, { passive: true })
    section.addEventListener('touchmove', onTouchMove, { passive: true })
    section.addEventListener('touchend', onTouchEnd)

    // Card click -> open URL
    const onCardClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(
        '.cyber-galaxy__card',
      )
      if (!card) return
      if (Math.abs(stateRef.current.velocity) >= 2) return
      const { url } = card.dataset
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    }
    section.addEventListener('click', onCardClick)

    // Card hover -> zoom in
    const onCardEnter = (e: Event) => {
      if (isMobile) return
      const card = e.currentTarget as HTMLElement
      const idx = wrappers.indexOf(card)
      if (idx === -1) return
      stateRef.current.activeIndex = idx
      stateRef.current.targetZoom = CONFIG.activeZoom
      stateRef.current.velocity = 0
    }
    const onCardLeave = () => {
      if (isMobile) return
      stateRef.current.activeIndex = -1
      stateRef.current.targetZoom = CONFIG.baseZoom
    }
    wrappers.forEach((el) => {
      if (el.classList.contains('cyber-galaxy__card')) {
        el.addEventListener('mouseenter', onCardEnter)
        el.addEventListener('mouseleave', onCardLeave)
      }
    })

    // D. Animation
    let raf = 0
    const tick = () => {
      const state = stateRef.current
      const zd = state.targetZoom - state.currentZoom
      if (Math.abs(zd) > 0.1) {
        state.currentZoom += zd * 0.1
        stage.style.transform = `translateZ(${state.currentZoom}px)`
      }
      if (!state.isDragging && state.activeIndex === -1) {
        if (Math.abs(state.velocity) > CONFIG.autoSpeed) {
          state.velocity *= 0.95
        } else {
          state.velocity = (state.velocity > 0 ? 1 : -1) * CONFIG.autoSpeed
        }
        state.rotation += state.velocity
      }
      carousel.style.transform = `rotateY(${state.rotation}deg)`
      const radRot = (state.rotation * Math.PI) / 180
      wrappers.forEach((el) => {
        if (!el.classList.contains('cyber-galaxy__card')) return
        const baseAngle = Number(el.dataset.angle) || 0
        const baseRad = (baseAngle * Math.PI) / 180
        const normalZ = Math.cos(baseRad + radRot)
        el.classList.toggle('is-backface', !(normalZ > 0.2))
      })
      raf = requestAnimationFrame(tick)
    }
    stage.style.transform = `translateZ(${CONFIG.baseZoom}px)`
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      section.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      section.removeEventListener('touchstart', onTouchStart)
      section.removeEventListener('touchmove', onTouchMove)
      section.removeEventListener('touchend', onTouchEnd)
      section.removeEventListener('click', onCardClick)
      wrappers.forEach((el) => {
        if (el.classList.contains('cyber-galaxy__card')) {
          el.removeEventListener('mouseenter', onCardEnter)
          el.removeEventListener('mouseleave', onCardLeave)
        }
        el.remove()
      })
    }
  }, [items])

  return (
    <section
      ref={sectionRef}
      className={`cyber-galaxy ${className ?? ''}`}
      data-testid="cyber-galaxy"
    >
      <div className="cyber-galaxy__overlay">
        <h2
          style={{
            position: 'absolute',
            top: 20,
            width: '100%',
            textAlign: 'center',
            zIndex: 10,
            margin: 0,
            fontSize: '1.5rem',
            color: 'var(--cyber-cyan)',
            fontFamily: 'var(--cyber-font-mono)',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: '100%',
            textAlign: 'center',
            zIndex: 10,
            fontFamily: 'var(--cyber-font-mono)',
            fontSize: '0.8rem',
            color: '#666',
          }}
        >
          {hint}
        </div>
      </div>
      <div ref={stageRef} className="cyber-galaxy__stage">
        <div ref={carouselRef} className="cyber-galaxy__carousel">
          <div
            ref={linesRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              transformStyle: 'preserve-3d',
            }}
          />
        </div>
      </div>
    </section>
  )
}
