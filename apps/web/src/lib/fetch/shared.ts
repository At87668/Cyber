import {
  allControllers,
  createClient,
  type IRequestAdapter,
  simpleCamelcaseKeys,
} from '@mx-space/api-client'
import type { $fetch } from 'ofetch'

import { API_URL } from '~/constants/env'

type FetchType = typeof $fetch

interface RequestOptions {
  method?: string
  data?: Record<string, any>
  params?: Record<string, any> | URLSearchParams
  headers?: Record<string, string>
  transformResponse?: false | (<T = any>(data: any) => T)
  next?: any
  cache?:
    | 'default'
    | 'force-cache'
    | 'no-cache'
    | 'no-store'
    | 'only-if-cached'
    | 'reload'
  [key: string]: any
}

type GetDeleteOptions = Omit<RequestOptions, 'data'>
type WriteOptions = Partial<RequestOptions>

export const createFetchAdapter = (
  $fetch: FetchType,
): IRequestAdapter<typeof $fetch> => ({
  default: $fetch,
  get(url: string, options?: GetDeleteOptions) {
    const { params } = options || {}
    return $fetch(url, {
      method: 'GET',
      query: params,
    })
  },
  post(url: string, options?: WriteOptions) {
    const { params, data } = options || {}
    return $fetch(url, {
      method: 'post',
      query: params,
      body: data,
    })
  },
  put(url: string, options?: WriteOptions) {
    const { params, data } = options || {}
    return $fetch(url, {
      method: 'put',
      query: params,
      body: data,
    })
  },
  patch(url: string, options?: WriteOptions) {
    const { params, data } = options || {}
    return $fetch(url, {
      method: 'patch',
      query: params,
      body: data,
    })
  },
  delete(url: string, options?: GetDeleteOptions) {
    const { params, data } = options || {}
    return $fetch(url, {
      method: 'delete',
      query: params,
      body: data,
    })
  },
})

/**
 * Build a v3-aware API client that speaks the v1/v2 host-app contract.
 *
 * The backend is now on `/api/v3` (see `apps/web/src/constants/env.ts`); every
 * controller returns the v3 envelope `{ data, meta? }` and v3 error shape
 * `{ error: { code, message, details? } }`. The rest of the web app was
 * written against the v1/v2 contract:
 *
 *   - list responses used to arrive as `{ data: T[], pagination }` (with
 *     `currentPage` / `totalPage`), and per-item `isLiked`, `likeCount`,
 *     `sourceLang`, `isTranslated`, …  used to be inlined on the model.
 *   - the `sortBy` query param accepted the legacy `created` / `modified`
 *     aliases.
 *
 * Rather than rewriting every query / loader / server-render helper, we
 * install a `transformResponse` hook that performs the V2↔V3 envelope
 * unwrap + pagination field remap in one place. This mirrors the behavior
 * of `legacyResponseAdapter` from `@mx-space/api-client/legacy`, but does
 * not require the `/legacy` subpath export (which is only available on
 * newer api-client versions).
 */

const remapPagination = (pg: any) => {
  if (!pg || typeof pg !== 'object') return pg
  // Support both camelCase (v2) and snake_case (v3) field names
  const currentPage = pg.currentPage ?? pg.page ?? pg.current_page
  const totalPage =
    pg.totalPage ?? pg.totalPages ?? pg.total_pages ?? pg.totalpage
  const { total } = pg
  const { size } = pg
  const out: Record<string, unknown> = {
    currentPage,
    totalPage,
    total,
    size,
    hasNextPage:
      pg.hasNextPage ??
      (typeof currentPage === 'number' && typeof totalPage === 'number'
        ? currentPage < totalPage
        : undefined),
    hasPrevPage:
      pg.hasPrevPage ??
      (typeof currentPage === 'number' ? currentPage > 1 : undefined),
  }
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k]
  return out
}

const isPaginateLike = (
  v: unknown,
): v is { data: unknown[]; pagination?: any } =>
  !!v && typeof v === 'object' && Array.isArray((v as any).data)

/**
 * Rewrite snake_case field names to the camelCase aliases the rest of the app
 * expects. The v3 backend serializes some timestamp fields as snake_case
 * (`created_at` / `modified_at`) but the rest of the codebase was written
 * against the v2 camelCase field names (`created` / `modified`).
 *
 * Must run BEFORE `simpleCamelcaseKeys`, because that function would mangle
 * `created_at` into `createdAt` (which doesn't match what the UI reads).
 */
const FIELD_ALIASES: Record<string, string> = {
  created_at: 'created',
  modified_at: 'modified',
}

const legacyTransformResponse = <T = any>(data: any): T => {
  const aliased = applyFieldAliases(data)
  if (isPaginateLike(aliased)) {
    return {
      ...simpleCamelcaseKeys(aliased),
      pagination: remapPagination(data.pagination),
    } as T
  }
  return simpleCamelcaseKeys(aliased) as T
}

const applyFieldAliases = (value: any): any => {
  if (Array.isArray(value)) return value.map(applyFieldAliases)
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value)) {
      const newKey = FIELD_ALIASES[k] ?? k
      out[newKey] = applyFieldAliases(v)
    }
    return out
  }
  return value
}

export const createApiClient = (
  fetchAdapter: ReturnType<typeof createFetchAdapter>,
) =>
  createClient(fetchAdapter)(API_URL, {
    controllers: allControllers,
    transformResponse: legacyTransformResponse,
    // ofetch returns the parsed body directly (not wrapped in { data: ... }).
    // The v3 backend wraps paginated responses as:
    //   { data: T[], meta: { pagination: { page, size, total, totalPages } } }
    // but the web app expects the legacy shape:
    //   { data: T[], pagination: { currentPage, totalPage, hasNextPage, ... } }
    // We reconstruct that shape here so all downstream consumers
    // (posts list, comments, says, series) get correct pagination info.
    getDataFromResponse: (res: any) => {
      if (!res) return null

      // v3 paginated envelope — meta.pagination is present
      if (res.meta?.pagination && Array.isArray(res.data)) {
        return {
          data: res.data,
          pagination: remapPagination(res.meta.pagination),
        }
      }

      // v3 non-paginated: { data: T } → return T directly
      if ('data' in res && !Array.isArray(res.data)) {
        return res.data
      }

      // Legacy v2 shape already has pagination at top level
      return res.data ?? res ?? null
    },
  })
