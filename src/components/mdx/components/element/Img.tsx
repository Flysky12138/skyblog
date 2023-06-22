'use client'

import Image from '@/components/Image'
import { ImageViewerContext } from '@/provider/image-viewer'
import React from 'react'

export default function Img({ alt, src, ...props }: React.ComponentProps<'img'>) {
  const { openViewer } = React.useContext(ImageViewerContext)

  return (
    <figure className="text-center">
      <Image
        alt={alt || ''}
        className="inline-block w-full max-w-screen-md cursor-pointer transition-shadow hover:ring"
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
