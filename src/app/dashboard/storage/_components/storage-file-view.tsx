'use client'

import { Treaty } from '@elysiajs/eden'
import { Fancybox } from '@fancyapps/ui'
import { Root, SlotProps } from '@radix-ui/react-slot'

import { getFileType } from '@/lib/file/info'
import { rpc } from '@/lib/http/rpc'

import { getPublicUrl } from './utils'

interface StorageFileViewProps extends SlotProps {
  asChild?: boolean
  file: Treaty.Data<ReturnType<typeof rpc.dashboard.storage.directories>['get']>['files'][number]
}

export function StorageFileView({ asChild, file, onClick, ...props }: StorageFileViewProps) {
  const types: ReturnType<typeof getFileType>[] = ['image', 'pdf']
  const type = getFileType(file.mimeType)

  if (!types.includes(type)) return null

  const Comp = asChild ? Root : 'div'

  return (
    <Comp
      onClick={event => {
        onClick?.(event)
        switch (type) {
          case 'image':
            Fancybox.show([{ src: getPublicUrl(file.s3Object.objectKey) }])
            break
          case 'pdf':
            window.open(getPublicUrl(file.s3Object.objectKey), '_blank')
            break
        }
      }}
      {...props}
    />
  )
}
