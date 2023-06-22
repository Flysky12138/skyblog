import _Image from 'next/image'
import React from 'react'

export const Image = ({ src, alt, width, height, ...props }: React.ComponentProps<'img'>) => {
  if (!src) return null

  const size = width && height ? { height: Number(height), width: Number(width) } : { fill: true }

  return <_Image alt={alt || ''} src={src} {...size} {...props} />
}
