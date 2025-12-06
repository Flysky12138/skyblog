import { revalidateTag } from 'next/cache'

import { EdgeConfigBodyType } from './model'

export abstract class Service {
  /**
   * vercel edge config's `create` | `update` | `upsert` | `delete` function
   * @see https://vercel.com/docs/storage/edge-config/vercel-api
   */
  static async action({ cacheTags, items }: EdgeConfigBodyType) {
    const res = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_ID}/items`, {
      body: JSON.stringify({ items }),
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_VERCEL}`,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error('Failed to patch edge config')
    }

    const data = await res.json()

    // https://vercel.com/docs/edge-config/vercel-api#failing-edge-config-patch-requests
    if ('error' in data) {
      throw new Error(data.error.message)
    }

    for (const cahceTag of cacheTags ?? []) {
      revalidateTag(cahceTag, 'max')
    }

    return data
  }
}
