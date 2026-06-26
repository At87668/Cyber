'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { m } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { usePresentSubscribeModal } from '~/components/modules/subscribe'
import { StyledButton } from '~/components/ui/button'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import { Link } from '~/i18n/navigation'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'

export const Windsock = () => {
  const t = useTranslations('common')

  const windsock = useMemo(
    () => [
      {
        title: t('windsock_friends'),
        path: '/friends',
      },
      {
        title: t('windsock_projects'),
        path: '/projects',
      },
      {
        title: t('windsock_says'),
        path: '/says',
      },
      {
        title: t('windsock_travel'),
        path: 'https://travel.moe/go.html',
      },
    ],
    [t],
  )
  const likeQueryKey = ['site-like']
  const { data: count } = useQuery({
    queryKey: likeQueryKey,
    queryFn: () => apiClient.proxy('like_this').get(),
    refetchInterval: 1000 * 60 * 5,
  })

  const queryClient = useQueryClient()
  const navigate = useRouter()

  const { present: presentSubscribe } = usePresentSubscribeModal()
  return (
    <>
      <div className="center mt-16 flex flex-col">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm opacity-80">
          {windsock.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="text-neutral duration-200 hover:text-accent! dark:text-neutral-200"
              onClick={() => {
                if (item.path.startsWith('/')) {
                  navigate.push(item.path)
                }
              }}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <StyledButton
          className="center flex gap-2 bg-red-400"
          onClick={() => {
            apiClient
              .proxy('like_this')
              .post()
              .then(() => {
                queryClient.setQueryData(likeQueryKey, (prev: any) => prev + 1)
              })

            toast.success(t('thanks'), {
              iconElement: (
                <m.i
                  className="i-mingcute-heart-fill text-error"
                  initial={{
                    scale: 0.96,
                  }}
                  animate={{
                    scale: 1.22,
                  }}
                  transition={{
                    ease: 'easeInOut',
                    delay: 0.3,
                    repeat: 5,
                    repeatDelay: 0.3,
                  }}
                />
              ),
            })
          }}
        >
          {t('like_site')} <i className="i-mingcute-heart-fill" />{' '}
          <NumberSmoothTransition>
            {count as any as string}
          </NumberSmoothTransition>
        </StyledButton>

        <StyledButton
          className="center flex gap-2"
          onClick={() => {
            presentSubscribe()
          }}
        >
          {t('subscribe')}
          <i className="i-material-symbols-notifications-active" />
        </StyledButton>
      </div>
    </>
  )
}
