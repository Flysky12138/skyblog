'use client'

import Image from '@/components/Image'
import { useImageViewerContext } from '@/provider/image-viewer'
import React from 'react'

export default function Img({ alt, src, ...props }: React.ComponentProps<'img'>) {
  const { openViewer } = useImageViewerContext()

  return (
    <figure className="text-center">
      <Image
        alt={alt || ''}
        className="inline-block w-full max-w-screen-md transition-shadow hover:ring"
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
