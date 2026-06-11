'use client'

import { useEffect, useState } from 'react'

import {
  BootScreen,
  CyberBackground,
  CyberCRT,
  CyberCursor,
} from '~/components/modules/cyber'

const STORAGE_KEY = 'mx-cyber-boot-shown'
const BOOT_MIN_DURATION_MS = 1800 // ensure the boot screen is visible for at least this long

/**
 * Drop-in client component that mounts the cyberpunk "system" effects
 * (CRT overlay, custom cursor, particle background, and a one-time
 * boot terminal). Intended to be placed once at the root of the layout.
 */
export const CyberEffectsLayer = () => {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY) === '1'
    if (alreadyShown) {
      setBooting(false)
      return
    }
    const startedAt = Date.now()
    const timers: ReturnType<typeof setTimeout>[] = []

    const reveal = () => {
      const remaining = BOOT_MIN_DURATION_MS - (Date.now() - startedAt)
      const delay = Math.max(0, remaining)
      timers.push(
        // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
        setTimeout(() => {
          sessionStorage.setItem(STORAGE_KEY, '1')
          setBooting(false)
        }, delay),
      )
    }

    // Worst case fallback in case the BootScreen never fires onDone.
    timers.push(
      // eslint-disable-next-line @eslint-react/web-api/no-leaked-timeout
      setTimeout(reveal, 6000),
    )
    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  return (
    <>
      <CyberCRT />
      <CyberBackground />
      <CyberCursor />
      {booting && (
        <BootScreen
          onDone={() => {
            sessionStorage.setItem(STORAGE_KEY, '1')
            setBooting(false)
          }}
        />
      )}
    </>
  )
}
