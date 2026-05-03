'use client'

import { mergeProps, useRender } from '@base-ui/react'
import { Treaty } from '@elysiajs/eden'
import { Fancybox } from '@fancyapps/ui'

import { FileHelper } from '@/lib/helper/file'
import { rpc } from '@/lib/http/rpc'

import { getPublicUrl } from './utils'

interface StorageFileViewProps extends useRender.ComponentProps<'div'> {
  file: Treaty.Data<ReturnType<typeof rpc.dashboard.storage.directories>['get']>['files'][number]
}

export function StorageFileView({ file, render, onClick, ...props }: StorageFileViewProps) {
  const types: ReturnType<typeof FileHelper.getFileType>[] = ['image', 'pdf']
  const type = FileHelper.getFileType(file.mimeType)

  const defaultProps: useRender.ElementProps<'div'> = {
    onClick: event => {
      onClick?.(event)
      switch (type) {
        case 'image':
          Fancybox.show([{ src: getPublicUrl(file.s3Object.objectKey) }])
          break
        case 'pdf':
          window.open(getPublicUrl(file.s3Object.objectKey), '_blank')
          break
      }
    }
  }

  const Comp = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(defaultProps, props),
    render
  })

  if (!types.includes(type)) return null

  return Comp
}
