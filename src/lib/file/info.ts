/**
 * 获取图片宽高
 */
export const getImageSize = async (blob: Blob) => {
  const url = URL.createObjectURL(blob)

  const image = new Image()
  image.src = url

  return new Promise<Record<'height' | 'width', number>>((resolve, reject) => {
    image.onload = () => {
      const { height, width } = image
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
 * 获取文件类型
 */
export const getFileType = (file: File | string = '') => {
  const type = file instanceof File ? file.type : file
  if (type.startsWith('image')) return 'image'
  if (type.startsWith('audio')) return 'audio'
  if (type.startsWith('video')) return 'video'
  if (type.startsWith('font')) return 'font'
  if (type.startsWith('text')) return 'text'

  if (type == 'application/pdf') return 'pdf'
  if (type == 'application/json') return 'json'
  if (type == 'application/zip') return 'zip'
}
