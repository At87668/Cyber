'use client'

import { useIsDark } from '~/hooks/common/use-is-dark'
import { clsxm } from '~/lib/helper'

interface StatsBoxProps {
  items: { label: string; value: string }[]
  className?: string
}

/**
 * Compact grid of stat counters in the cyberpunk theme.
 * Each value glows in cyan with a subtle terminal prefix.
 */
export const StatsBox = ({ items, className }: StatsBoxProps) => {
  const isDark = useIsDark()

  return (
    <div
      className={clsxm(
        'mx-auto my-16 grid w-full max-w-5xl grid-cols-2 gap-4 px-4 lg:grid-cols-4',
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="cyber-card"
          style={{ padding: '20px 24px' }}
          data-interactive
        >
          <div
            style={{
              fontFamily: 'var(--cyber-font-mono)',
              color: isDark ? 'var(--cyber-cyan)' : '#0097a7',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {'> '}
            {item.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--cyber-font-mono)',
              color: isDark ? '#fff' : '#111',
              fontSize: '1.6rem',
              fontWeight: 700,
              textShadow: isDark
                ? '0 0 10px rgba(0,243,255,0.45)'
                : '0 0 8px rgba(0,151,167,0.2)',
              marginTop: 6,
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}
