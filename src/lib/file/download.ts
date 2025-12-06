/**
 * 下载
 * @param blob 二进制文件对象
 * @param filename 文件名
 */
export const download = async (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.download = filename
  a.href = url

  a.click()

  URL.revokeObjectURL(url)
}
