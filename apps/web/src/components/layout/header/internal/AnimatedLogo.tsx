'use client'

import { m } from 'motion/react'
import { useCallback } from 'react'

import { isOwnerLogged } from '~/atoms/hooks/owner'
import { useResolveAdminUrl } from '~/atoms/hooks/url'
import { useViewport } from '~/atoms/hooks/viewport'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useSingleAndDoubleClick } from '~/hooks/common/use-single-double-click'
import { useRouter } from '~/i18n/navigation'
import { clsxm } from '~/lib/helper'
import { noopObj } from '~/lib/noop'
import { Routes } from '~/lib/route-builder'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import { useLiveQuery } from './useLiveQuery'

const SiteNameText = ({ className }: { className?: string }) => {
  const siteName = useAggregationSelector((data) => data.seo.title)

  return (
    <span
      className={clsxm(
        'line-clamp-1 text-lg font-semibold leading-none',
        className,
      )}
    >
      {siteName}
    </span>
  )
}

const TapableLogo = () => {
  const router = useRouter()

  const { data: isLiving } = useLiveQuery()

  const { liveId } = (useAppConfigSelector(
    (config) => config.module?.bilibili,
  ) || noopObj) as Bilibili

  const goLive = useCallback(() => {
    window.open(`https://live.bilibili.com/${liveId}`)
  }, [liveId])

  const resolveAdminUrl = useResolveAdminUrl()

  const fn = useSingleAndDoubleClick(
    () => {
      if (isLiving) return goLive()
      router.push(Routes.Home)
    },
    () => {
      if (isOwnerLogged()) {
        location.href = resolveAdminUrl()

        return
      }
      router.push(
        `${Routes.Login}?redirect=${encodeURIComponent(location.pathname)}`,
      )
    },
  )

  return (
    <button onClick={fn}>
      <SiteNameText className="cursor-pointer" />
      <span className="sr-only">Site Name</span>
    </button>
  )
}
export const AnimatedLogo = () => {
  const isDesktop = useViewport(($) => $.lg && $.w !== 0)

  const isClient = useIsClient()
  if (!isClient) return null

  if (isDesktop) return <TapableLogo />

  return (
    <m.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center will-change-[unset]!"
    >
      <TapableLogo />
    </m.div>
  )
}
