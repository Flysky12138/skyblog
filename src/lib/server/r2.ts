import { DeleteObjectsCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'

export type R2MetadataType = {
  height?: string
  width?: string
}

export type R2FileInfoType = UnwrapPromise<ReturnType<typeof R2.info>>

const Bucket = process.env.NEXT_PUBLIC_R2_BUCKET_NAME
const S3 = new S3Client({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_ACCESS_KEY
  },
  endpoint: process.env.NEXT_PUBLIC_S3_API,
  region: 'auto'
})

export class R2 {
  /** 获取直链 */
  static get(key: string) {
    return `${process.env.NEXT_PUBLIC_R2_URL}/${key}`
  }

  /** 获取目录结构 */
  static async list<T>(Prefix: T extends `/${string}` ? never : T extends `${string}/` | '' ? T : never) {
    const { CommonPrefixes, Contents } = await S3.send(new ListObjectsV2Command({ Bucket, Prefix, Delimiter: '/' }))
    const data = {
      files: Contents ? await Promise.all(Contents.filter(it => it.Key).map(async file => this.info(file.Key!))) : [],
      folders: CommonPrefixes?.map(it => it.Prefix!) || []
    }
    return data
  }

  /** 获取文件信息 */
  static async info(Key: string) {
    const head = await S3.send(new HeadObjectCommand({ Bucket, Key }))
    return {
      contentType: head.ContentType,
      key: Key,
      lastModified: head.LastModified!,
      metadata: (head.Metadata || {}) as R2MetadataType,
      size: head.ContentLength || 0
    }
  }

  /**
   * 覆盖、新增
   * @default
   * metadata = {}
   */
  static async put({
    Key,
    Body,
    ContentType,
    Metadata = {}
  }: {
    Body: NonNullable<PutObjectCommandInput['Body']>
    ContentType: string
    Key: string
    Metadata: R2MetadataType
  }) {
    await S3.send(new PutObjectCommand({ Body, Bucket, ContentType, Key, Metadata }))
    return {
      contentType: ContentType,
      key: Key,
      lastModified: new Date(),
      metadata: Metadata,
      size: 0
    } satisfies R2FileInfoType
  }

  /** 删除 */
  static async delete(Keys: string[]) {
    return await S3.send(
      new DeleteObjectsCommand({
        Bucket,
        Delete: {
          Objects: Keys.map(Key => ({ Key }))
        }
      })
    )
  }
}
