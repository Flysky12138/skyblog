'use client'

import NextImage from 'next/image'
import React from 'react'

import PictureError from '@/assets/svg/picture-error.svg'

import { DisplayByConditional } from './display/display-by-conditional'

export interface ImageProps extends Omit<React.ComponentProps<typeof NextImage>, 'src'> {
  src: string
}

export const Image = ({ height, width, ...props }: ImageProps) => {
  const [isError, setIsError] = React.useState(false)

  const size: Partial<ImageProps> = width && height ? { height, width } : { fill: true }

  return (
    <DisplayByConditional condition={!isError} fallback={<PictureError className="inline-block" height={80} width={80} />}>
      <NextImage
        onError={() => {
          setIsError(true)
        }}
        {...size}
        {...props}
      />
    </DisplayByConditional>
  )
}
