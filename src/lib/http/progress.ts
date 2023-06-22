export interface ProgressProps {
  /** 已加载字节数 */
  loaded: number
  /** 进度 0-100 */
  progress: number
  /** 总字节数 */
  total: number
}

/**
 * 获取下载进度
 */
export const readResponseProgress = async (response: Response, onProgress: (props: ProgressProps) => void) => {
  if (!response.body) return new Blob()

  const total = Number.parseInt(response.headers.get('content-length') || '0', 10)
  let loaded = 0

  const reader = response.body.getReader()
  const chunks = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    chunks.push(value)
    loaded += value.length

    if (total) {
      onProgress({ loaded, progress: Math.round((loaded / total) * 100), total })
    } else {
      onProgress({ loaded, progress: 0, total: 0 })
    }
  }

  return new Blob(chunks)
}
