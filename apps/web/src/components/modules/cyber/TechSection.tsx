'use client'

import { useRef } from 'react'

import { clsxm } from '~/lib/helper'

export interface TechBadge {
  name: string
  /** Tailwind-style class or hex color for the background, e.g. 'bg-blue-500'. */
  color?: string
  /** Foreground color, default 'white'. */
  fg?: string
  /** Text shown on the badge. */
  text: string
}

export interface TechCard {
  id: string
  title: string
  badges: TechBadge[]
}

interface TechSectionProps {
  title?: string
  cards: TechCard[]
  className?: string
}

/**
 * 3D-tilt neon cards. Renders the `cards` prop in a responsive grid.
 * Each card flips subtly toward the cursor while hovered.
 */
export const TechSection = ({
  title = '// NEURAL_MODULES',
  cards,
  className,
}: TechSectionProps) => {
  return (
    <section className={clsxm('mx-auto max-w-6xl px-4 py-12', className)}>
      <h2 className="cyber-section-title">{title}</h2>
      <div
        className="mx-auto grid w-full max-w-[1200px] gap-10"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          perspective: '1000px',
        }}
      >
        {cards.map((card) => (
          <TechCardItem key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}

const TechCardItem = ({ card }: { card: TechCard }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <div
      ref={ref}
      className="cyber-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-interactive
    >
      <div style={{ transform: 'translateZ(30px)' }}>
        <div className="cyber-card__title">{card.title}</div>
        <div className="flex flex-wrap gap-2">
          {card.badges.map((b) => (
            <span
              key={b.name}
              className="cyber-badge"
              style={{
                backgroundColor: b.color ?? '#1f2937',
                color: b.fg ?? '#fff',
              }}
            >
              {b.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
