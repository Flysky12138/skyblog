import 'client-only'

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
