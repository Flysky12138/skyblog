'use server'

import { digest, EdgeConfigValue, get, getAll, has } from '@vercel/edge-config'
import { updateTag } from 'next/cache'

import { CacheTag } from '@/lib/cache'
import { VERCEL_EDGE_CONFIG } from '@/lib/constants'

interface PatchOption {
  key: ValueOf<typeof VERCEL_EDGE_CONFIG>
  operation: 'create' | 'delete' | 'update' | 'upsert'
  value?: EdgeConfigValue
}

/**
 * vercel edge config's `create` | `update` | `upsert` | `delete` function
 * @see https://vercel.com/docs/storage/edge-config/vercel-api
 */
const patch = async (items: PatchOption[], cacheTags: (keyof typeof CacheTag.EDGE_CONFIG)[] = []) => {
  try {
    const res = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_ID}/items`, {
      body: JSON.stringify({ items }),
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_VERCEL}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH'
    })
    const data = await res.json()

    // https://vercel.com/docs/edge-config/vercel-api#failing-edge-config-patch-requests
    if ('error' in data) throw new Error(data.error.message)

    for (const cahceTag of cacheTags) {
      updateTag(cahceTag)
    }

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export { digest, get, getAll, has, patch }
