'use client'

import { useEffect, useState } from 'react'

import { Galaxy, type GalaxyItem } from '~/components/modules/cyber'

interface GitHubRepo {
  stargazers_count: number
  full_name: string
}

interface CyberProject {
  /** id used as React key + github owner/repo fetch */
  repo?: string
  title: string
  body: string
  variant?: GalaxyItem['variant']
  tag: string
  url?: string
}

const PROJECTS: CyberProject[] = [
  {
    title: 'NexusBlog',
    body: 'A modern personal blog built with Next.js, Tailwind, and Motion. Crafted for the cyber era.',
    variant: 'web',
    tag: 'TypeScript',
    url: 'https://github.com/At87668/Cyber',
  },
  {
    title: 'CyberConsole',
    body: 'A drop-in developer console that mirrors the cyberpunk theme. Replaces noisy logs with structured output.',
    variant: 'console',
    tag: 'TypeScript',
    url: 'https://github.com/At87668/Cyber',
  },
  {
    title: 'NeonLinks',
    body: 'A friend-link portal with neon hover effects, friend graph visualizations, and rich RSS aggregation.',
    variant: 'light',
    tag: 'TypeScript',
    url: 'https://github.com/At87668/Cyber',
  },
  {
    title: 'Galaxy',
    body: 'A 3D project carousel inspired by retro sci-fi dashboards. Drag to rotate, hover to focus.',
    variant: 'miner',
    tag: 'TypeScript',
    url: 'https://github.com/At87668/Cyber',
  },
]

/**
 * Cyber-themed project showcase: a 3D rotating "galaxy" of project cards.
 * Pulls live star counts from the GitHub API when a `repo` is provided.
 */
export const CyberShowcase = () => {
  const [items, setItems] = useState<GalaxyItem[]>(
    PROJECTS.map((p) => ({
      id: p.title,
      title: p.title,
      body: p.body,
      variant: p.variant,
      tag: p.tag,
      meta: '⭐ …',
      url: p.url,
    })),
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const fetched = await Promise.all(
        PROJECTS.map(async (p) => {
          if (!p.repo) {
            return { id: p.title, meta: '⭐ N/A' }
          }
          try {
            const res = await fetch(`https://api.github.com/repos/${p.repo}`, {
              headers: { Accept: 'application/vnd.github+json' },
            })
            if (!res.ok) return { id: p.title, meta: '⭐ ?' }
            const data = (await res.json()) as GitHubRepo
            return { id: p.title, meta: `⭐ ${data.stargazers_count}` }
          } catch {
            return { id: p.title, meta: '⭐ ?' }
          }
        }),
      )
      if (cancelled) return
      setItems((prev) =>
        prev.map((it) => {
          const found = fetched.find((f) => f.id === it.id)
          return found ? { ...it, meta: found.meta } : it
        }),
      )
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Galaxy
      items={items}
      title="// PROJECT_GALAXY"
      hint="[ DRAG TO ROTATE SYSTEM ]"
    />
  )
}
