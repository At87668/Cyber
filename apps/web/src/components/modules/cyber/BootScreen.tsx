'use client'

import { useEffect, useState } from 'react'

interface BootScreenProps {
  /** Logs to stream into the boot terminal, one line at a time. */
  logs?: string[]
  /** Called once the boot sequence has fully finished. */
  onDone?: () => void
}

const DEFAULT_LOGS = [
  'Initializing kernel...',
  'Loading neural network weights...',
  'Connecting to github_api_v3...',
  'Decrypting user profile...',
  'Allocating memory blocks...',
  'Loading Galaxy Module...',
  'System check: OK',
  'Launching interface...',
]

/**
 * A short terminal-style boot sequence that fades out and reveals
 * the page content. Inspired by the reference cyberpunk hero.
 */
export const BootScreen = ({
  logs = DEFAULT_LOGS,
  onDone,
}: BootScreenProps) => {
  const [lines, setLines] = useState<string[]>([])
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    let i = 0
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const pushNext = () => {
      if (cancelled) return
      if (i >= logs.length) {
        timers.push(
          // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
          setTimeout(() => {
            if (cancelled) return
            setHidden(true)
            timers.push(
              // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
              setTimeout(() => {
                if (cancelled) return
                setRemoved(true)
                onDone?.()
              }, 1000),
            )
          }, 500),
        )
        return
      }
      setLines((prev) => [...prev, `> ${logs[i]}`])
      i += 1
      // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
      timers.push(setTimeout(pushNext, Math.random() * 200 + 50))
    }
    pushNext()
    return () => {
      cancelled = true
      timers.forEach((t) => clearTimeout(t))
    }
  }, [logs, onDone])

  if (removed) return null

  return (
    <div
      className="cyber-boot"
      style={{ opacity: hidden ? 0 : 1 }}
      aria-hidden="true"
    >
      <div>
        {lines.map((line) => (
          <div key={line} className="cyber-boot__line">
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
