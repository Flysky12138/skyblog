import { createSHA1, createSHA256, createSHA384, createSHA512 } from 'hash-wasm'

export abstract class FileHelper {
  /**
   * 创建文件对象
   *
   * @default mimeType = 'application/octet-stream'
   */
  static createFile(content: BlobPart | BlobPart[], fileName: string, mimeType = 'application/octet-stream'): File {
    const blob = new Blob(Array.isArray(content) ? content : [content], { type: mimeType })
    return new File([blob], fileName, { type: mimeType })
  }

  /**
   * 下载文件
   *
   * @default mimeType = 'application/octet-stream'
   */
  static downloadFile(content: BlobPart | BlobPart[], fileName: string, mimeType = 'application/octet-stream') {
    const blob = new Blob(Array.isArray(content) ? content : [content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 获取文件大小（格式化）
   *
   * @example
   * formatFileSize(114514) // 111.83 KB
   */
  static formatFileSize(bytes: number): string {
    if (bytes == 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

    // i = log₁₀₂₄(bytes) = log(bytes) / log(1024)
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const value = bytes / Math.pow(k, i)

    return i == 0 ? `${value} B` : `${value.toFixed(2)} ${sizes[i]}`
  }

  /**
   * 获取文件名（不含扩展名）
   */
  static getBaseName(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.')
    return lastDotIndex == -1 ? fileName : fileName.slice(0, lastDotIndex)
  }

  /**
   * 获取文件扩展名
   */
  static getExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.')
    return lastDotIndex == -1 ? '' : fileName.slice(lastDotIndex + 1).toLowerCase()
  }

  /**
   * 获取文件的哈希值
   */
  static async getFileHash(
    file: File,
    /**
     * @default 'SHA-256'
     */
    algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256',
    /**
     * 进度回调，大文件才会触发
     */
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (file.size <= 50 * 1024 * 1024) {
      const buffer = await this.readFileAsArrayBuffer(file)
      const hashBuffer = await crypto.subtle.digest(algorithm, buffer)
      return Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('')
    } else {
      const hashFactoryMap = { 'SHA-1': createSHA1, 'SHA-256': createSHA256, 'SHA-384': createSHA384, 'SHA-512': createSHA512 } satisfies Record<
        typeof algorithm,
        Function
      >

      const hasher = await hashFactoryMap[algorithm]()
      hasher.init()

      let loaded = 0
      let lastYieldTime = performance.now()

      for await (const chunk of file.stream()) {
        hasher.update(chunk)

        loaded += chunk.byteLength
        onProgress?.((loaded / file.size) * 100)

        // 每帧让出一次主线程，避免明显的卡顿。最好还是使用 worker
        if (performance.now() - lastYieldTime > 16) {
          lastYieldTime = performance.now()
          await new Promise(requestAnimationFrame)
        }
      }

      return hasher.digest()
    }
  }

  /**
   * 获取文件类型
   */
  static getFileType(mimeType?: string) {
    if (!mimeType) return 'unknown'

    if (mimeType.startsWith('image')) return 'image'
    if (mimeType.startsWith('audio')) return 'audio'
    if (mimeType.startsWith('video')) return 'video'
    if (mimeType.startsWith('font')) return 'font'
    if (mimeType.startsWith('text')) return 'text'

    if (mimeType == 'application/pdf') return 'pdf'
    if (mimeType == 'application/json') return 'json'
    if (mimeType == 'application/zip') return 'zip'

    return 'unknown'
  }

  /**
   * 获取图片宽高
   */
  static async getImageSize(blob: Blob): Promise<{ height: number; width: number }> {
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.src = url

    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve({
          height: image.height,
          width: image.width
        })
        URL.revokeObjectURL(url)
      }
      image.onerror = () => {
        reject(new Error('图片格式错误，获取信息失败'))
        URL.revokeObjectURL(url)
      }
    })
  }

  /**
   * 检查文件类型是否匹配
   */
  static isFileType(file: File, types: string | string[]): boolean {
    const typeList = Array.isArray(types) ? types : [types]
    return typeList.some(type => {
      if (type.endsWith('/*')) {
        const prefix = type.slice(0, -2)
        return file.type.startsWith(prefix)
      }
      return file.type == type
    })
  }

  /**
   * 读取文件为 ArrayBuffer
   */
  static readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 读取文件为 DataURL
   */
  static readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * 读取文件为文本
   */
  static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  /**
   * 校验文件大小
   */
  static validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    return file.size <= maxSizeInBytes
  }
}
