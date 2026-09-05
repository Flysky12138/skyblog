'use client'

import { Treaty } from '@elysiajs/eden'
import { Fancybox } from '@repo/components/fancybox'
import { mergeProps, useRender } from '@repo/ui/base'

import { FileHelper } from '@/lib/helper/file'
import { rpc } from '@/lib/http/rpc'
import { Storage } from '@/lib/http/storage'

interface StorageFileViewProps extends useRender.ComponentProps<'div'> {
  file: Treaty.Data<ReturnType<typeof rpc.dashboard.storage.directories>['get']>['files'][number]
}

export function StorageFileView({ file, render, onClick, ...props }: StorageFileViewProps) {
  const types: ReturnType<typeof FileHelper.getFileType>[] = ['image', 'pdf']
  const type = FileHelper.getFileType(file.mimeType)

  const url = Storage.getPublicUrl(file.id)

  const defaultProps: useRender.ElementProps<'div'> = {
    onClick: event => {
      onClick?.(event)
      switch (type) {
        case 'image':
          Fancybox.show([{ src: url }])
          break
        case 'pdf':
          window.open(url, '_blank', 'noopener')
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
