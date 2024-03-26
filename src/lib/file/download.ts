import 'client-only'

export const download = async (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)

  const a = Object.assign(document.createElement('a'), {
    download: filename,
    href: url
  })

  a.click()

  URL.revokeObjectURL(url)
}
