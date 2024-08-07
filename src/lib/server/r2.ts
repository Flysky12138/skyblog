import { R2Object, R2Objects } from '@cloudflare/workers-types/2023-07-01'
import { CustomFetch } from './fetch'

export class R2 {
  static #url = process.env.NEXT_PUBLIC_R2_URL
  static #headers = {
    'X-R2-SECRET': process.env.NEXT_PUBLIC_R2_SECRET
  }

  static get(key: string) {
    return `${this.#url}/${key}`
  }

  /** 获取目录结构 */
  static async list(key: string) {
    const url = new URL(key, this.#url)
    return await CustomFetch<R2Objects>(url, {
      headers: this.#headers,
      method: 'GET'
    })
  }

  /** 覆盖、新增 */
  static async put(payload: { body: Blob; key: string; metadata?: Record<string, string> }) {
    const url = new URL(payload.key, this.#url)
    url.search = new URLSearchParams(payload.metadata).toString()
    return await CustomFetch<R2Object>(url, {
      body: payload.body,
      headers: this.#headers,
      method: 'PUT'
    })
  }

  /** 删除 */
  static async delete(key: string) {
    const url = new URL(key, this.#url)
    return await CustomFetch<void>(url, {
      headers: this.#headers,
      method: 'DELETE'
    })
  }
}
