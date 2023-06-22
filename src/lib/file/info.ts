/**
 * 获取文件名
 */
export const getFileName = (file: File) => file.webkitRelativePath || file.name

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
export const getFileType = (mimeType?: string) => {
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
 * 获取文件名和后缀
 */
export const parseFileName = (filename: string) => {
  const idx = filename.lastIndexOf('.')

  if (idx == -1) {
    return {
      ext: '',
      name: filename
    }
  }

  return {
    ext: filename.slice(idx + 1).toLowerCase(),
    name: filename.slice(0, idx)
  }
}
