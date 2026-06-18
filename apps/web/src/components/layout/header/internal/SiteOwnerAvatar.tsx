'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { clsxm } from '~/lib/helper'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const SiteOwnerAvatar: Component = ({ className }) => {
  const t = useTranslations('common')
  const avatar = useAggregationSelector((data) => data.user.avatar)

  if (!avatar) return

  return (
    <div
      role="img"
      className={clsxm(
        'pointer-events-none relative z-[9] size-[40px] select-none',
        className,
      )}
    >
      <div className="mask mask-squircle overflow-hidden">
        <Image
          src={avatar}
          alt={t('aria_site_owner_avatar')}
          width={40}
          height={40}
          className="ring-2 ring-slate-200 dark:ring-neutral-800"
        />
      </div>
    </div>
  )
}
