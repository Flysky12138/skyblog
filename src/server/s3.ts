'use server'

import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  UploadPartCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { verifyLogin } from '@/lib/auth'

const BUCKET = process.env.R2_BUCKET_NAME!
const R2_URL = process.env.NEXT_PUBLIC_R2_URL!

if (!BUCKET || !R2_URL) {
  throw new Error('R2 env not configured')
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  },
  endpoint: process.env.R2_S3_API!,
  region: 'auto',
  requestChecksumCalculation: 'WHEN_REQUIRED'
})

const normalizeKey = (key: string) => key.replace(/^\/+/, '')

/**
 * 获取公共直链
 */
const _getPublicUrl = (key: string) => {
  return `${R2_URL.replace(/\/$/, '')}/${normalizeKey(key)}`
}

/**
 * 列出目录
 */
export const LIST = async (prefix = ''): Promise<S3.ListResult> => {
  if (prefix.startsWith('/')) {
    throw new Error('Prefix should not start with "/"')
  }

  await verifyLogin()

  const { CommonPrefixes, Contents } = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Delimiter: '/',
      Prefix: prefix
    })
  )

  return {
    files:
      Contents?.filter(item => item.Key && item.Key != prefix).map(item => ({
        key: item.Key!,
        lastModified: item.LastModified ?? new Date(),
        metadata: {},
        size: item.Size ?? 0
      })) ?? [],
    folders: CommonPrefixes?.map(item => item.Prefix!) ?? []
  }
}

/**
 * 获取文件信息
 */
export const INFO = async (key: string): Promise<S3.FileInfo> => {
  await verifyLogin()

  const Key = normalizeKey(key)

  const head = await s3.send(
    new HeadObjectCommand({
      Bucket: BUCKET,
      Key
    })
  )

  return {
    contentType: head.ContentType,
    key: Key,
    lastModified: head.LastModified ?? new Date(),
    metadata: head.Metadata ?? {},
    size: head.ContentLength ?? 0
  }
}

/**
 * 上传 / 覆盖
 */
export const PUT = async (options: {
  body: NonNullable<PutObjectCommandInput['Body']>
  contentType: string
  key: string
  metadata?: S3.Metadata
}): Promise<S3.FileInfo> => {
  await verifyLogin()

  const Key = normalizeKey(options.key)

  await s3.send(
    new PutObjectCommand({
      Body: options.body,
      Bucket: BUCKET,
      ContentType: options.contentType,
      Key,
      Metadata: options.metadata as Record<string, string>
    })
  )

  return INFO(Key)
}

/**
 * 删除对象
 */
export const DELETE = async (keys: string[]) => {
  await verifyLogin()

  if (!keys.length) {
    return { Deleted: [] }
  }

  return s3.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: keys.map(key => ({ Key: normalizeKey(key) }))
      }
    })
  )
}

/**
 * 初始化 Multipart Upload
 */
export const initMultipartUpload = async (options: { contentType: string; key: string; metadata?: S3.Metadata }) => {
  await verifyLogin()

  const Key = normalizeKey(options.key)

  const res = await s3.send(
    new CreateMultipartUploadCommand({
      Bucket: BUCKET,
      ContentType: options.contentType,
      Key,
      Metadata: options.metadata as Record<string, string>
    })
  )

  return {
    uploadId: res.UploadId!
  }
}

/**
 * 获取分片上传的 Presigned URL
 */
export const signPart = async (options: { key: string; partNumber: number; uploadId: string }) => {
  await verifyLogin()

  const Key = normalizeKey(options.key)

  const url = await getSignedUrl(
    s3,
    new UploadPartCommand({
      Bucket: BUCKET,
      Key,
      PartNumber: options.partNumber,
      UploadId: options.uploadId
    }),
    {
      expiresIn: 60 * 1 // 1 分钟
    }
  )

  return { url }
}

/**
 * 完成 Multipart Upload
 */
export const completeMultipartUpload = async (options: {
  key: string
  parts: {
    ETag: string
    PartNumber: number
  }[]
  uploadId: string
}) => {
  await verifyLogin()

  const Key = normalizeKey(options.key)

  await s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: BUCKET,
      Key,
      MultipartUpload: {
        Parts: options.parts
      },
      UploadId: options.uploadId
    })
  )

  return INFO(Key)
}

/**
 * 终止 Multipart Upload
 */
export const abortMultipartUpload = async (options: { key: string; uploadId: string }) => {
  await verifyLogin()

  const Key = normalizeKey(options.key)

  return s3.send(
    new AbortMultipartUploadCommand({
      Bucket: BUCKET,
      Key,
      UploadId: options.uploadId
    })
  )
}
