export type ImageFileInfoType = {
  height: number
  size: number
  type: string
  width: number
}

export const getImageFileInfo = async (content: string | File | Blob) => {
  let url = content as string

  switch (Object.prototype.toString.call(content).slice(8, -1)) {
    case 'File':
    case 'Blob':
      url = URL.createObjectURL(content as File | Blob)
      break
    case 'String':
      if ((content as string).startsWith('data:')) {
        const blob = new Blob([content], { type: 'text/plain' })
        url = URL.createObjectURL(blob)
      }
      break
  }

  const image = new Image()
  image.src = url

  const { type, size } = await fetch(url).then(res => res.blob())

  const ans = await new Promise<ImageFileInfoType>(resolve => {
    image.onload = () => {
      URL.revokeObjectURL(url)
      const { width, height } = image
      resolve({ height, size, type, width })
    }
  })

  return ans
}
