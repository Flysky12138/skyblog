'use client'

import React from 'react'

import PictureError from '@/assets/svg/picture-error.svg'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { useImageViewerContext } from '@/providers/image-viewer'

interface ImgProps extends Omit<React.ComponentProps<'img'>, 'src'> {
  src: string
}

export const Img = ({ alt = '', src, ...props }: ImgProps) => {
  const { openViewer } = useImageViewerContext()

  const [isError, setIsError] = React.useState(false)

  return (
    <figure className="text-center">
      <DisplayByConditional condition={!isError} fallback={<PictureError className="inline-block" height={80} width={80} />}>
        <img
          alt={alt}
          className="inline-block w-full max-w-3xl rounded-sm"
          decoding="async"
          loading="lazy"
          role="button"
          src={src}
          onClick={() => {
            openViewer({
              images: [{ key: 1, src }]
            })
          }}
          onError={() => {
            setIsError(true)
          }}
          {...props}
        />
      </DisplayByConditional>
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  )
}
