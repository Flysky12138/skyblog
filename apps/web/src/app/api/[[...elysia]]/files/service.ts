import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { prisma } from '@/lib/prisma'

import { s3 } from '../dashboard/storage/utils'

export abstract class Service {
  /**
   * 获取文件 URL
   */
  static async url(id: string) {
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        s3Object: true
      }
    })

    if (!file) {
      return null
    }

    return getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: file.s3Object.objectKey,
        ResponseContentDisposition: `inline; filename*=UTF-8''${encodeURIComponent(file.name)}.${file.ext}`
      }),
      {
        expiresIn: 60 * 5 // 有效期 5 分钟
      }
    )
  }
}
