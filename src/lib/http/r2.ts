import { DeleteObjectsCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'

const Bucket = process.env.NEXT_PUBLIC_R2_BUCKET_NAME
const S3 = new S3Client({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_ACCESS_KEY
  },
  endpoint: process.env.NEXT_PUBLIC_S3_API,
  region: 'auto',
  requestChecksumCalculation: 'WHEN_REQUIRED'
})

export class R2 {
  /**
   * 删除
   */
  static async delete(Keys: string[]) {
    return S3.send(
      new DeleteObjectsCommand({
        Bucket,
        Delete: {
          Objects: Keys.map(Key => ({ Key }))
        }
      })
    )
  }

  /**
   * 获取直链
   */
  static get(key: string) {
    return `${process.env.NEXT_PUBLIC_R2_URL}/${key}`
  }

  /**
   * 获取文件信息
   */
  static async info(Key: string): Promise<R2.FileInfo> {
    const head = await S3.send(new HeadObjectCommand({ Bucket, Key }))
    return {
      contentType: head.ContentType,
      key: Key,
      lastModified: head.LastModified!,
      metadata: head.Metadata || {},
      size: head.ContentLength || 0
    }
  }

  /**
   * 获取目录结构
   */
  static async list<T>(Prefix: T extends StartsWith<'/'> ? never : T extends '' | EndsWith<'/'> ? T : never) {
    const { CommonPrefixes, Contents } = await S3.send(new ListObjectsV2Command({ Bucket, Delimiter: '/', Prefix }))
    return {
      files: Contents ? await Promise.all(Contents.filter(it => it.Key).map(async file => this.info(file.Key!))) : [],
      folders: CommonPrefixes?.map(it => it.Prefix!) || []
    }
  }

  /**
   * 覆盖、新增
   * @default
   * metadata = {}
   */
  static async put({
    Body,
    ContentType,
    Key,
    Metadata = {}
  }: {
    Body: NonNullable<PutObjectCommandInput['Body']>
    ContentType: string
    Key: string
    Metadata: R2.Metadata
  }): Promise<R2.FileInfo> {
    await S3.send(new PutObjectCommand({ Body, Bucket, ContentType, Key, Metadata: Metadata as Record<string, string> }))
    return {
      contentType: ContentType,
      key: Key,
      lastModified: new Date(),
      metadata: Metadata,
      size: 0
    }
  }
}
