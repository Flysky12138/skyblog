/**
 * 使用 canvas 压缩图片
 */
export async function compressImageByCanvas({
  file,
  mimeType,
  quality
}: {
  file: File
  /**
   * 输出图片格式
   */
  mimeType: string
  /**
   * 压缩质量 0~1
   */
  quality: number
}): Promise<Blob> {
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
        if (!blob) {
          return reject(new Error('图片格式错误，获取信息失败'))
        }
        resolve(blob)
      },
      mimeType,
      quality
    )
  })
}
