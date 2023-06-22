'use client'

import React from 'react'

import PictureError from '@/assets/svg/picture-error.svg'
import { DisplayByConditional } from '@/components/display/display-by-conditional'

interface ImgProps extends Omit<React.ComponentProps<'img'>, 'src'> {
  src: string
}

export function Img({ alt = '', src, ...props }: ImgProps) {
  const [isError, setIsError] = React.useState(false)

  return (
    <figure className="flex w-fit flex-col items-center @max-5xl:mx-auto">
      <DisplayByConditional condition={!isError} fallback={<PictureError className="inline-block" height={80} width={80} />}>
        <img
          data-fancybox
          alt={alt}
          className="inline-block w-full max-w-3xl rounded-sm"
          data-src={src}
          decoding="async"
          loading="lazy"
          role="button"
          src={src}
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
