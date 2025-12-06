import { limitAsync } from 'es-toolkit'

import { rpc, unwrap } from '@/lib/http/rpc'

/**
 * SWR key for storage list
 */
export const STORAGE_LIST_SWR_KEY = (id: string) => ['019b6af1-3ebe-7088-bfac-a8847e7b5a9f', id] as const

/**
 * 上传文件分片大小，10M
 */
export const PART_SIZE = 10 * 1024 * 1024

/**
 * 获取 S3 直链
 */
export const getPublicUrl = (key: string) => `${process.env.NEXT_PUBLIC_R2_URL.replace(/\/$/, '')}/${key}`

/**
 * 分片上传
 */
export const chunkUpload = async ({ file, id, type }: { file: File; id: string; type: string }) => {
  // 初始化
  const { uploadId } = await rpc.dashboard.storage.objects['multipart-upload'].create.post({ contentType: type, key: id }).then(unwrap)
  // 开始上传
  const partUpload = async (index: number) => {
    const partNumber = index + 1
    const { url } = await rpc.dashboard.storage.objects['multipart-upload']['sign-part'].post({ key: id, partNumber, uploadId }).then(unwrap)
    const res = await fetch(url, {
      body: file.slice(index * PART_SIZE, (index + 1) * PART_SIZE),
      method: 'PUT'
    })
    if (!res.ok) {
      throw new Error(`Part ${partNumber} upload failed`)
    }
    return {
      ETag: res.headers.get('ETag') ?? undefined,
      PartNumber: partNumber
    }
  }
  const limit = limitAsync(partUpload, 5)
  const parts = await Promise.all(Array.from({ length: Math.ceil(file.size / PART_SIZE) }, (_, index) => limit(index)))
  // 完成上传
  const { Bucket } = await rpc.dashboard.storage.objects['multipart-upload'].complete.post({ key: id, parts, uploadId }).then(unwrap)
  return Bucket!
}
