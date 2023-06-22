import Image from 'next/image'
import React from 'react'

export default function Img({ src, alt, width, height, ref, ...props }: React.ComponentProps<'img'>) {
  if (!src) return null

  return (
    <Image
      alt={alt || ''}
      src={src}
      {...(width && height
        ? {
            height: Number.parseFloat(String(height)),
            width: Number.parseFloat(String(width))
          }
        : {
            fill: true
          })}
      {...props}
    />
  )
}
