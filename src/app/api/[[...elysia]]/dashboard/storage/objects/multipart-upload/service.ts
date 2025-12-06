import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand } from '@aws-sdk/client-s3'
import { UploadPartCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { s3 } from '../../utils'
import {
  StorageObjectMultipartUploadAbortBodyType,
  StorageObjectMultipartUploadCompleteBodyType,
  StorageObjectMultipartUploadCreateBodyType,
  StorageObjectMultipartUploadSignPartBodyType
} from './model'

export abstract class Service {
  /**
   * 终止 Multipart Upload
   */
  static async abort({ key, uploadId }: StorageObjectMultipartUploadAbortBodyType) {
    return s3.send(
      new AbortMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        UploadId: uploadId
      })
    )
  }

  /**
   * 完成 Multipart Upload
   */
  static async complete({ key, parts, uploadId }: StorageObjectMultipartUploadCompleteBodyType) {
    return s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts
        }
      })
    )
  }

  /**
   * 创建 Multipart Upload
   */
  static async create({ contentType, key }: StorageObjectMultipartUploadCreateBodyType) {
    const res = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        ContentType: contentType,
        Key: key
      })
    )

    return {
      uploadId: res.UploadId!
    }
  }

  /**
   * 签名分片
   */
  static async signPart({ key, partNumber, uploadId }: StorageObjectMultipartUploadSignPartBodyType) {
    const url = await getSignedUrl(
      s3,
      new UploadPartCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId
      }),
      {
        expiresIn: 60 * 5 // 有效期 5 分钟
      }
    )

    return { url }
  }
}
