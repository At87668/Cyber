'use client'

import {
  CyberBackground,
  CyberCRT,
  CyberCursor,
} from '~/components/modules/cyber'

/**
 * Drop-in client component that mounts the cyberpunk "system" effects
 * (CRT overlay, custom cursor, particle background).
 * Intended to be placed once at the root of the layout.
 */
export const CyberEffectsLayer = () => {
  return (
    <>
      <CyberCRT />
      <CyberBackground />
      <CyberCursor />
    </>
  )
}
