declare namespace R2 {
  /** 自定义对象元数据 */
  interface Metadata {
    height?: string
    width?: string
  }
  /** 文件信息 */
  interface FileInfo {
    contentType?: string
    key: string
    lastModified: Date
    metadata: R2.Metadata
    size: number
  }
}
