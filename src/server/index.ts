import { promiseAllPool } from '@/lib/promise'

import * as edgeConfig from './edge-config'
import * as s3 from './s3'

export const EdgeConfigService = {
  get: edgeConfig.GET,
  has: edgeConfig.HAS,
  patch: edgeConfig.PATCH
}

export const S3Service = {
  delete: s3.DELETE,
  info: s3.INFO,
  list: s3.LIST,
  /** 获取公共直链 */
  getPublicUrl: (key: string) => `${process.env.NEXT_PUBLIC_R2_URL.replace(/\/$/, '')}/${key.replace(/^\/+/, '')}`,
  put: async (options: { body: File; contentType: string; key: string; metadata?: S3.Metadata }) => {
    const { body, contentType, key, metadata } = options

    const { uploadId } = await s3.initMultipartUpload({ contentType, key, metadata })

    const PART_SIZE = 10 << 20
    const PART_COUNT = Math.ceil(body.size / PART_SIZE)

    const parts: { ETag: string; PartNumber: number }[] = []

    await promiseAllPool(
      Array.from({ length: PART_COUNT }).map((_, i) => async () => {
        const partNumber = i + 1
        const { url } = await s3.signPart({ key, partNumber, uploadId })

        const blob = body.slice(i * PART_SIZE, (i + 1) * PART_SIZE)
        const res = await fetch(url, { body: blob, method: 'PUT' })

        parts.push({
          ETag: res.headers.get('ETag')!,
          PartNumber: partNumber
        })
      })
    )

    return s3.completeMultipartUpload({ key, parts, uploadId })
  }
}
