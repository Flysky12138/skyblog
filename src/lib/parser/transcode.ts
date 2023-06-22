import { isBrowser } from 'es-toolkit'

/**
 * `Blob` | `File` -> `Base64`
 */
export const file2base64 = async (file: Blob | File): Promise<string> => {
  if (isBrowser()) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  return `data:${file.type};base64,${base64}`
}
