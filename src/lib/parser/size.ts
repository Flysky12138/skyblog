/**
 * 文件大小
 * @example
 * formatFileSize(114514) // 111.83 KB
 */
export const formatFileSize = (byte: number) => {
  if (byte < 2 ** 10) return byte + ' B'
  if (byte < 2 ** 20) return (byte / 2 ** 10).toFixed(2) + ' KB'
  if (byte < 2 ** 30) return (byte / 2 ** 20).toFixed(2) + ' MB'
  if (byte < 2 ** 40) return (byte / 2 ** 30).toFixed(2) + ' GB'
  if (byte < 2 ** 50) return (byte / 2 ** 40).toFixed(2) + ' TB'
  return byte.toString()
}
