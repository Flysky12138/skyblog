'use client'

import { Treaty } from '@elysiajs/eden'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { getFileType } from '@/lib/file/info'
import { rpc } from '@/lib/http/rpc'

import { getPublicUrl } from './utils'

interface StorageFileLinkCopyProps extends React.PropsWithChildren {
  file: Treaty.Data<ReturnType<typeof rpc.dashboard.storage.directories>['get']>['files'][number]
}

export function StorageFileLinkCopy({ children, file }: StorageFileLinkCopyProps) {
  const [_, copy] = useCopyToClipboard()

  const links = [{ label: '直链', value: getPublicUrl(file.s3Object.objectKey) }]

  switch (getFileType(file.mimeType)) {
    case 'image':
      links.push(
        { label: 'Markdown', value: `![${file.name}](${getPublicUrl(file.s3Object.objectKey)})` },
        {
          label: 'HTML',
          value: `::img{alt="${file.name}" src="${getPublicUrl(file.s3Object.objectKey)}" width="${file.metadata.width}" height="${file.metadata.height}"}`
        }
      )
      break
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-xs md:max-w-md">
        {links.map(({ label, value }, index) => (
          <DropdownMenuItem
            key={index}
            className="cursor-pointer"
            onSelect={() => {
              copy(value)
              toast.success('复制成功')
            }}
          >
            <Item className="w-full p-1">
              <ItemContent>
                <ItemTitle>
                  <Badge className="rounded-sm">{label}</Badge>
                </ItemTitle>
                <ItemDescription className="line-clamp-none text-wrap break-all">{value}</ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
