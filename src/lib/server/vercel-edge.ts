import { EdgeConfigValue } from '@vercel/edge-config'
import { CustomFetch } from './fetch'

interface VercelEdgeFetchOption {
  key: string
  operation: 'create' | 'update' | 'upsert' | 'delete'
  value?: EdgeConfigValue
}

/**
 * vercel edge config's `create | update | upsert | delete` function
 * @see https://vercel.com/docs/storage/edge-config/vercel-api
 */
export const VercelEdgeFetch = async (items: VercelEdgeFetchOption[]) => {
  try {
    const data = await CustomFetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_ID}/items`, {
      body: { items },
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_VERCEL}`
      },
      method: 'PATCH'
    })

    if ('error' in data) throw new Error(data.error)

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
