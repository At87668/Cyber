'use client'

import { type TechCard, TechSection } from '~/components/modules/cyber'

const CARDS: TechCard[] = [
  {
    id: 'frontend',
    title: '01_LANGUAGES',
    badges: [
      { name: 'ts', text: 'TypeScript', color: '#3178c6' },
      { name: 'js', text: 'JavaScript', color: '#f7df1e', fg: '#000' },
      { name: 'css', text: 'CSS3', color: '#1572b6' },
      { name: 'html', text: 'HTML5', color: '#e34f26' },
    ],
  },
  {
    id: 'runtime',
    title: '02_FRAMEWORKS',
    badges: [
      { name: 'next', text: 'Next.js', color: '#000000', fg: '#fff' },
      { name: 'react', text: 'React', color: '#20232a' },
      { name: 'tailwind', text: 'Tailwind', color: '#38bdf8' },
      { name: 'motion', text: 'Motion', color: '#7c3aed' },
    ],
  },
  {
    id: 'infra',
    title: '03_INFRASTRUCTURE',
    badges: [
      { name: 'node', text: 'Node.js', color: '#339933' },
      { name: 'docker', text: 'Docker', color: '#2496ed' },
      { name: 'cloudflare', text: 'Cloudflare', color: '#f38020' },
      { name: 'github', text: 'GitHub Actions', color: '#2088ff' },
    ],
  },
]

export const CyberTech = () => (
  <TechSection title="// NEURAL_MODULES" cards={CARDS} />
)
