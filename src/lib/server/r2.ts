import { R2Object, R2Objects } from '@cloudflare/workers-types/2023-07-01'
import { calculateBlobAlgorithm } from '../file/info'
import { CustomFetch } from './fetch'

export class R2 {
  static #url = process.env.NEXT_PUBLIC_R2_URL
  static #headers = {
    'X-R2-SECRET': process.env.NEXT_PUBLIC_R2_SECRET
  }

  /** 获取直链 */
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

  /**
   * 覆盖、新增
   * @default
   * metadata = {}
   */
  static async put({ blob, key, metadata = {} }: { blob: Blob; key: string; metadata?: Record<string, string | number> }) {
    const formData = new FormData()
    formData.set('blob', blob)
    formData.set('key', key)
    formData.set('metadata', JSON.stringify(metadata))
    formData.set('sha1', await calculateBlobAlgorithm(blob))
    return await CustomFetch<R2Object>(this.#url, {
      body: formData,
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
