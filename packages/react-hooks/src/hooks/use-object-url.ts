import React from 'react'

export function useObjectUrl(value: Blob | null | undefined): string | undefined
export function useObjectUrl(value: Blob[]): string[]
export function useObjectUrl<T extends Blob | Blob[] | null | undefined>(value: T) {
  const urls = React.useMemo(() => {
    if (!value) return undefined

    if (Array.isArray(value)) {
      return value.map(item => URL.createObjectURL(item))
    }

    return URL.createObjectURL(value)
  }, [value])

  React.useEffect(() => {
    return () => {
      if (Array.isArray(urls)) {
        urls.forEach(url => URL.revokeObjectURL(url))
      } else if (urls) {
        URL.revokeObjectURL(urls)
      }
    }
  }, [urls])

  return urls
}
