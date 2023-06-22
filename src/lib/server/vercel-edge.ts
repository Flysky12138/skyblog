import { EDGE_CONFIG } from '../constants'
import { CustomFetch } from './fetch'

type EdgeRequestItemType = { key: string; operation: 'create' | 'update' | 'upsert' | 'delete'; value?: unknown }

/**
 * @see https://vercel.com/docs/storage/edge-config/vercel-api
 */
export const edgeFetch = async (items?: EdgeRequestItemType[]) => {
  try {
    const data = await CustomFetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_ID}/items`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_VERCEL}`
      },
      ...(items
        ? {
            body: { items },
            method: 'PATCH'
          }
        : {
            method: 'GET'
          })
    })

    if ('error' in data) throw new Error(data.error)

    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export type EdgeGetResponseType<T = (typeof EDGE_CONFIG)[keyof typeof EDGE_CONFIG], V = unknown> = {
  [K in T as K extends string ? K : never]?: {
    createdAt: number
    edgeConfigId: string
    key: K
    updatedAt: number
    value: V | null
  }
}
