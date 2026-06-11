'use client'

import { clsxm } from '~/lib/helper'

interface GlitchTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'span'
}

/**
 * Cyberpunk-style "glitch" headline. Renders three copies of the text
 * (the main one + two chromatic-aberration layers) to mimic the
 * reference design's clip-path / RGB split effect.
 */
export const GlitchText = ({
  text,
  className,
  as: Tag = 'div',
}: GlitchTextProps) => (
  <Tag data-text={text} className={clsxm('cyber-glitch', className)}>
    {text}
  </Tag>
)
