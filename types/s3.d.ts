declare namespace S3 {
  /** 文件信息 */
  interface FileInfo {
    contentType?: string
    key: string
    lastModified: Date
    metadata: S3.Metadata
    size: number
  }
  interface ListResult {
    files: FileInfo[]
    folders: string[]
  }
  /** 自定义对象元数据 */
  interface Metadata {
    height?: string
    width?: string
  }
}
