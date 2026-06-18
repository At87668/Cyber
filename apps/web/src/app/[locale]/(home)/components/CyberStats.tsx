'use client'

import { useQuery } from '@tanstack/react-query'

import { StatsBox } from '~/components/modules/cyber'
import { apiClient } from '~/lib/request'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

/**
 * Cyberpunk-flavoured stat strip. Pulls a couple of live numbers
 * (like count + the site owner's name) and renders them in a 4-up grid
 * of glowing neon "modules".
 */
export const CyberStats = () => {
  const { data: count } = useQuery({
    queryKey: ['site-like'],
    queryFn: () => apiClient.proxy('like_this').get(),
    refetchInterval: 1000 * 60 * 5,
  })
  const user = useAggregationSelector((s) => s.user)
  const url = useAggregationSelector((s) => s.url)

  const host = (() => {
    try {
      return url?.webUrl ? new URL(url.webUrl).host : 'NEXUS'
    } catch {
      return 'NEXUS'
    }
  })()

  const items = [
    { label: 'STATUS', value: 'ONLINE' },
    { label: 'UPLINK', value: host },
    { label: 'LIKES', value: String(count ?? 0) },
    { label: 'OPERATOR', value: user?.name?.toUpperCase() ?? 'N/A' },
  ]

  return <StatsBox items={items} />
}
