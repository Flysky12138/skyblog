export type ImageFileInfoType = {
  height: number
  size: number
  type: string
  width: number
}

export const getImageFileInfo = async (blob: File | Blob) => {
  const url = URL.createObjectURL(blob)

  const image = new Image()
  image.src = url

  return new Promise<ImageFileInfoType>((resolve, reject) => {
    image.onload = () => {
      const { width, height } = image
      const { type, size } = blob
      resolve({ height, size, type, width })
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      reject('图片格式错误，获取信息失败')
      URL.revokeObjectURL(url)
    }
  })
}
