'use client'

import ImageViewer from '@/components/ImageViewer'
import { Chip } from '@mui/joy'
import React from 'react'
import { useToggle } from 'react-use'

interface ImagesPropsType {
  children: React.ReactNode
  className?: string
  defaultAlt?: string
}

export default function Images({ children, className, defaultAlt }: ImagesPropsType) {
  const [open, openToggle] = useToggle(false)

  const images: React.ReactElement[] = []
  React.Children.forEach(children, item => {
    if (!React.isValidElement(item)) return
    if (item.props.src) images.push(item)
  })

  return (
    <section className={className}>
      <div className="relative cursor-pointer [&_img]:m-0" onClick={openToggle}>
        {images[0]}
        {images.length > 0 && <Chip className="absolute bottom-1 right-1">{images.length}</Chip>}
      </div>
      <ImageViewer
        images={images.map(({ props }, key) => ({
          key,
          src: props.src
        }))}
        overlayRender={({ index }) => (
          <div className="absolute inset-x-0 bottom-0 z-50 bg-white/50 p-2 opacity-75 dark:bg-black/50">
            <p className="text-wrap break-all">{defaultAlt || images[index].props.alt}</p>
          </div>
        )}
        visible={open}
        onClose={openToggle}
      />
    </section>
  )
}
