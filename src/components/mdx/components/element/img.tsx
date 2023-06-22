'use client'

import { Image } from '@/components/image'
import { useImageViewerContext } from '@/providers/image-viewer'
import React from 'react'

export const Img = ({ alt, src, ...props }: React.ComponentProps<'img'>) => {
  const { openViewer } = useImageViewerContext()

  return (
    <figure className="text-center">
      <Image
        alt={alt || ''}
        className="inline-block w-full max-w-(--breakpoint-md) rounded-lg transition-shadow hover:ring-3"
        role="button"
        src={src}
        onClick={() => {
          openViewer({
            images: [{ src, key: 1 }]
          })
        }}
        {...props}
      />
      <figcaption>{alt}</figcaption>
    </figure>
  )
}
