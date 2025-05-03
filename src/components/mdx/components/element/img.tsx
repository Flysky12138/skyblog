'use client'

import { Image, ImageProps } from '@/components/image'
import { useImageViewerContext } from '@/providers/image-viewer'

export const Img = ({ alt = '', src, ...props }: ImageProps) => {
  const { openViewer } = useImageViewerContext()

  return (
    <figure className="text-center">
      <Image
        alt={alt}
        className="inline-block w-full max-w-3xl rounded-lg transition-shadow hover:ring-3"
        role="button"
        src={src}
        onClick={() => {
          openViewer({
            images: [{ key: 1, src }]
          })
        }}
        {...props}
      />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  )
}
