'use client'

import { useEffect, useRef, useState } from 'react'

interface TypewriterProps {
  /** Text to type out, one character at a time. */
  text: string
  /** Minimum delay between characters in ms. */
  minDelay?: number
  /** Maximum additional random delay between characters in ms. */
  jitter?: number
  /** Called once when typing has completed. */
  onDone?: () => void
  className?: string
}

/**
 * Simple typewriter: appends characters to a span on an interval.
 * Auto-resets and replays when the text prop changes.
 */
export const Typewriter = ({
  text,
  minDelay = 50,
  jitter = 50,
  onDone,
  className,
}: TypewriterProps) => {
  const [value, setValue] = useState('')
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    setValue('')
    indexRef.current = 0

    const tick = () => {
      if (indexRef.current >= text.length) {
        doneRef.current?.()
        return
      }
      setValue((prev) => prev + text.charAt(indexRef.current))
      indexRef.current += 1
      timerRef.current = setTimeout(tick, minDelay + Math.random() * jitter)
    }
    timerRef.current = setTimeout(tick, minDelay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, minDelay, jitter])

  return (
    <span className={className}>
      {value}
      <span className="cyber-terminal-caret">_</span>
    </span>
  )
}
