'use client'

import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { m } from 'motion/react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { GlitchText, Typewriter } from '~/components/modules/cyber'
import { isSupportIcon, SocialIcon } from '~/components/modules/home/SocialIcon'
import {
  fetchHitokoto,
  SentenceType,
} from '~/components/modules/shared/Hitokoto'
import { MotionButtonBase } from '~/components/ui/button'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { softBouncePreset } from '~/constants/spring'
import { clsxm } from '~/lib/helper'
import { noopObj } from '~/lib/noop'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import { TwoColumnLayout } from './TwoColumnLayout'

const DEFAULT_TERMINAL_LINE =
  'Crafting code with purpose. Building the future with tech.'

export const Hero = () => {
  const tCommon = useTranslations('common')
  const heroConfig = useAppConfigSelector((config) => config?.hero)
  const siteOwner = useAggregationSelector((agg) => agg?.user)
  const { avatar, socialIds, name } = siteOwner || {}

  const title = heroConfig?.title
  const description = heroConfig?.description

  const titleAnimateD =
    (title?.template ?? []).reduce(
      (acc, cur) => acc + (cur.text?.length || 0),
      0,
    ) * 50

  // The user-configured title is rendered as a glitching headline.
  // Fallback to the site owner name if no template was provided.
  const glitchText =
    title?.template
      ?.map((t) => t.text ?? '')
      .join(' ')
      .trim() ||
    name ||
    'NEXUS'

  return (
    <div className="mx-auto mt-20 min-w-0 max-w-7xl overflow-hidden lg:mt-[-4.5rem] lg:h-dvh lg:min-h-[800px] lg:px-8">
      <TwoColumnLayout
        leftContainerClassName="mt-[120px] lg:mt-0 lg:h-[15rem] lg:h-1/2"
        rightContainerClassName="lg:flex lg:justify-end lg:items-end"
      >
        <>
          <m.div
            className="group relative text-center leading-[4] lg:text-left [&_*]:inline-block"
            initial={{ opacity: 0.0001, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={softBouncePreset}
          >
            <GlitchText
              as="h1"
              text={glitchText}
              className="text-5xl lg:text-6xl"
            />
          </m.div>

          {/* System status pill */}
          <div className="mt-8 text-center lg:text-left">
            <div className="cyber-status">
              <span className="cyber-status__dot" />
              <span>SYSTEM STATUS: ONLINE // NEXUS INTEGRATED</span>
            </div>
          </div>

          <BottomToUpTransitionView
            delay={titleAnimateD + 500}
            transition={softBouncePreset}
            className="my-3 text-center lg:text-left"
          >
            <span className="opacity-80">{description}</span>
          </BottomToUpTransitionView>

          <ul className="center mx-[60px] mt-8 flex flex-wrap gap-4 gap-y-6 lg:mx-auto lg:mt-8 lg:justify-start lg:gap-y-4">
            {Object.entries(socialIds || noopObj).map(
              ([type, id]: any, index) => {
                if (!isSupportIcon(type)) return null
                return (
                  <BottomToUpTransitionView
                    key={type}
                    delay={index * 100 + titleAnimateD + 500}
                    className="inline-block"
                    as="li"
                  >
                    <SocialIcon id={id} type={type} />
                  </BottomToUpTransitionView>
                )
              },
            )}
          </ul>
        </>

        <div
          className={clsx(
            'lg:size-[300px]',
            'size-[200px]',
            'mt-24 lg:mt-0',
            'relative',
          )}
        >
          {/* Hex / scanline ring around the avatar */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                '0 0 0 1px var(--cyber-cyan), 0 0 25px rgba(0,243,255,0.45), inset 0 0 25px rgba(188,19,254,0.25)',
            }}
          />
          {avatar && (
            <Image
              height={300}
              width={300}
              src={avatar}
              alt={tCommon('aria_site_owner_avatar')}
              className={clsxm(
                'aspect-square rounded-full border border-slate-200 dark:border-neutral-800',
                'w-full',
              )}
            />
          )}
        </div>

        <m.div
          initial={{ opacity: 0.0001, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={softBouncePreset}
          className={clsx(
            'center inset-x-0 bottom-0 mt-12 flex flex-col lg:absolute lg:mt-0',

            'center text-neutral-800/80 dark:text-neutral-200/80',
          )}
        >
          <div className="cyber-terminal-line text-center">
            {'> '}
            <Typewriter text={description || DEFAULT_TERMINAL_LINE} />
          </div>
          <FootHitokoto />
          <span className="mt-8 animate-bounce">
            <i className="i-mingcute-right-line rotate-90 text-2xl" />
          </span>
        </m.div>
      </TwoColumnLayout>
    </div>
  )
}

const FootHitokoto = () => {
  const t = useTranslations('home')
  const hitokoto = useAppConfigSelector((config) => config.hero?.hitokoto)
  const { custom, random } = hitokoto || {}

  if (random) return <RemoteHitokoto />
  return (
    <small className="text-center">
      {custom ?? t('hero_default_hitokoto')}
    </small>
  )
}

const RemoteHitokoto = () => {
  const {
    data: hitokoto,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['hitokoto'],
    queryFn: () =>
      fetchHitokoto([
        SentenceType.动画,
        SentenceType.原创,
        SentenceType.哲学,
        SentenceType.文学,
      ]).then((data) => {
        const postfix = Object.values({
          from: data.from,
          from_who: data.from_who,
          creator: data.creator,
        }).find(Boolean)
        if (!data.hitokoto) {
          return null
        } else {
          return data.hitokoto + (postfix ? ` —— ${postfix}` : '')
        }
      }),
    refetchInterval: 30_0000,
    staleTime: Infinity,
    refetchOnMount: 'always',
    meta: {
      persist: true,
    },
  })

  const memoedLoadingRef = useRef(isLoading)

  if (!hitokoto) return null

  return (
    <m.small
      initial={
        isLoading ? { opacity: 0.0001, y: 50 } : memoedLoadingRef.current
      }
      animate={{ opacity: 1, y: 0 }}
      className="group flex w-[80ch] items-center justify-center text-balance"
    >
      {hitokoto}
      <MotionButtonBase
        className={clsxm(
          'ml-3 flex items-center duration-200 group-hover:opacity-100',

          isRefetching ? 'animate-spin' : 'opacity-0',
        )}
        disabled={isRefetching}
        onClick={() => refetch()}
      >
        <i className="i-mingcute-refresh-2-line" />
      </MotionButtonBase>
    </m.small>
  )
}
