import Image from 'next/image'
import React from 'react'

export default function Img({ src, alt, width, height, ...props }: React.ComponentProps<'img'>) {
  if (!src) return null

  const size =
    width && height
      ? {
          height: Number.parseFloat(String(height)) / 4,
          width: Number.parseFloat(String(width)) / 4
        }
      : {
          fill: true
        }

  return <Image alt={alt || ''} src={src} {...size} {...props} />
}
