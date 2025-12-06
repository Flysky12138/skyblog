'use server'

import { EdgeConfigValue, get, has } from '@vercel/edge-config'
import { updateTag } from 'next/cache'

import { assertAdminRole } from '@/lib/auth/server'
import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'

interface PatchOption {
  key: ValueOf<typeof VERCEL_EDGE_CONFIG_KEY>
  operation: 'create' | 'delete' | 'update' | 'upsert'
  value?: EdgeConfigValue
}

export const GET = async <T>(key: ValueOf<typeof VERCEL_EDGE_CONFIG_KEY>) => {
  return get<T>(key)
}

export const HAS = async (key: ValueOf<typeof VERCEL_EDGE_CONFIG_KEY>) => {
  return has(key)
}

/**
 * vercel edge config's `create` | `update` | `upsert` | `delete` function
 * @see https://vercel.com/docs/storage/edge-config/vercel-api
 */
export const PATCH = async (items: PatchOption[], cacheTags: ValueOf<typeof CACHE_TAG.EDGE_CONFIG>[] = []) => {
  await assertAdminRole()

  const res = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_ID}/items`, {
    body: JSON.stringify({ items }),
    headers: {
      Authorization: `Bearer ${process.env.TOKEN_VERCEL}`,
      'Content-Type': 'application/json'
    },
    method: 'PATCH'
  })
  if (!res.ok) {
    throw new Error('Failed to patch edge config')
  }
  const data = await res.json()

  // https://vercel.com/docs/edge-config/vercel-api#failing-edge-config-patch-requests
  if ('error' in data) {
    throw new Error(data.error.message)
  }

  for (const cahceTag of cacheTags) {
    updateTag(cahceTag)
  }

  return data
}
