interface CompressImageByCanvas {
  file: File
  /** 输出图片格式 */
  mimeType: string
  /** 压缩质量 0~1 */
  quality: number
}

interface ImageCompressionGroup {
  /** 输出文件扩展名 */
  ext: string
  /** 输出图片格式 */
  mimeType: string
  name: string
}

export const imageCompressionGroup: ImageCompressionGroup[] = [
  { ext: 'jpg', mimeType: 'image/jpeg', name: 'JPEG' },
  { ext: 'webp', mimeType: 'image/webp', name: 'WEBP' }
]

/**
 * 使用 canvas 压缩图片
 */
export const compressImageByCanvas = async ({ file, mimeType, quality }: CompressImageByCanvas): Promise<Blob> => {
  const img = new Image()
  img.src = URL.createObjectURL(file)

  await img.decode()

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // 限制尺寸
  const maxW = 1920
  const scale = Math.min(1, maxW / img.width)

  canvas.width = img.width * scale
  canvas.height = img.height * scale

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) return reject('图片格式错误，获取信息失败')
        resolve(blob)
      },
      mimeType,
      quality
    )
  })
}
