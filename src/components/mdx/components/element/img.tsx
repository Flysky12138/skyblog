'use client'

import { useImageViewerContext } from '@/providers/image-viewer'
import Image from 'next/image'
import React from 'react'

export const Img = ({ alt = '', src, width, height, ...props }: React.ComponentProps<'img'>) => {
  const { openViewer } = useImageViewerContext()

  const size = width && height ? { height: Number(height), width: Number(width) } : { fill: true }

  return (
    <figure className="text-center">
      <Image
        alt={alt}
        className="inline-block w-full max-w-3xl rounded-lg transition-shadow hover:ring-3"
        role="button"
        src={src!}
        onClick={() => {
          openViewer({
            images: [{ src, key: 1 }]
          })
        }}
        {...size}
        {...props}
      />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  )
}
