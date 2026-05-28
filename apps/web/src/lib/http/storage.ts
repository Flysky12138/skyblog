import { limitAsync, range } from 'es-toolkit'

import { STORAGE } from '../constants'
import { FileHelper } from '../helper/file'
import { rpc, unwrap } from './rpc'

export abstract class Storage {
  /**
   * 获取直链
   *
   * @param id 文件 ID
   */
  static getPublicUrl(id: string) {
    return `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/files/${id}/url`
  }

  /**
   * 上传文件
   */
  static async uploadFile({
    directory = {},
    file,
    s3ObjectKey
  }: {
    file: File
    /**
     * 对象 key，默认获取文件 sha256
     */
    s3ObjectKey?: string
    directory?: {
      /**
       * 父文件夹 ID
       */
      id?: string
      /**
       * 子文件夹名称
       */
      names?: string[]
    }
  }) {
    s3ObjectKey ??= await FileHelper.getFileHash(file)

    // 检查文件是否已上传
    const objectDetail = await rpc.dashboard.storage.objects({ key: s3ObjectKey }).get().then(unwrap)
    let bucket = objectDetail?.bucket

    // 上传文件
    if (!bucket) {
      bucket = await Storage.#chunkUpload({
        file,
        key: s3ObjectKey
      })
    }

    // 保存记录到数据库
    return rpc.dashboard.storage.files
      .post({
        directory: {
          id: directory.id ?? STORAGE.ROOT_DIRECTORY_ID,
          names: directory.names
        },
        file: {
          ext: FileHelper.getExtension(file.name),
          mimeType: file.type,
          name: FileHelper.getBaseName(file.name),
          size: file.size,
          metadata: {
            ...(FileHelper.getFileType(file.type) == 'image' ? await FileHelper.getImageSize(file) : {})
          }
        },
        s3Object: {
          bucket,
          objectKey: s3ObjectKey
        }
      })
      .then(unwrap)
  }

  /**
   * 分片上传
   */
  static async #chunkUpload({
    file,
    key,
    partSize = 10 * 1024 * 1024
  }: {
    file: File
    /**
     * 文件 sha256
     */
    key: string
    /**
     * 分片大小
     *
     * @default 10 * 1024 * 1024
     */
    partSize?: number
  }) {
    // 初始化
    const { uploadId } = await rpc.dashboard.storage.objects['multipart-upload'].create.post({ contentType: file.type, key }).then(unwrap)

    const partUpload = async (index: number) => {
      const partNumber = index + 1
      const { url } = await rpc.dashboard.storage.objects['multipart-upload']['sign-part'].post({ key, partNumber, uploadId }).then(unwrap)
      const res = await fetch(url, {
        body: file.slice(index * partSize, (index + 1) * partSize),
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

    // 开始上传
    const parts = await Promise.all(range(Math.ceil(file.size / partSize)).map(limit))

    // 完成上传
    const { Bucket } = await rpc.dashboard.storage.objects['multipart-upload'].complete.post({ key, parts, uploadId }).then(unwrap)

    return Bucket ?? process.env.R2_BUCKET_NAME
  }
}
