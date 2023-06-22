/** 获取图片宽高 */
export const getImageSize = async (blob: Blob) => {
  const url = URL.createObjectURL(blob)

  const image = new Image()
  image.src = url

  return new Promise<Record<'width' | 'height', number>>((resolve, reject) => {
    image.onload = () => {
      const { width, height } = image
      resolve({ height, width })
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      reject('图片格式错误，获取信息失败')
      URL.revokeObjectURL(url)
    }
  })
}

/**
 * 计算 hash
 * @default
 * algorithm = 'SHA-1'
 */
export const calculateBlobAlgorithm = async (blob: Blob, algorithm: `SHA-${1 | 256 | 384 | 512}` = 'SHA-1') => {
  const buffer = await blob.arrayBuffer()
  const data = new Uint8Array(buffer)
  const md5 = await crypto.subtle.digest(algorithm, data)
  return Array.from(new Uint8Array(md5))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
