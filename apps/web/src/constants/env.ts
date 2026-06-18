import { env } from 'next-runtime-env'

import { isClientSide, isDev } from '~/lib/env'

export const API_URL: string = (() => {
  if (isDev) {
    // Dev mode: server-side uses the absolute URL (no CORS issue),
    // client-side uses the relative path so Next.js rewrites proxy it
    if (isClientSide) return '/api/v3'
    return env('NEXT_PUBLIC_API_URL') || ''
  }

  if (isClientSide && env('NEXT_PUBLIC_CLIENT_API_URL')) {
    return env('NEXT_PUBLIC_CLIENT_API_URL') || ''
  }

  return env('NEXT_PUBLIC_API_URL') || '/api/v3'
})() as string
export const GATEWAY_URL = env('NEXT_PUBLIC_GATEWAY_URL') || ''
