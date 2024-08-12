'use client'

import Image from '@/components/Image'
import { ImageViewerContext } from '@/provider/image-viewer'
import React from 'react'

export default function Img({ alt, src, ...props }: React.ComponentProps<'img'>) {
  const { openViewer } = React.useContext(ImageViewerContext)

  return (
    <Image
      alt={alt || ''}
      className="mx-auto w-full max-w-screen-md cursor-pointer"
      src={src}
      onClick={() => {
        openViewer({
          images: [{ src, key: 1 }]
        })
      }}
      {...props}
    />
  )
}
