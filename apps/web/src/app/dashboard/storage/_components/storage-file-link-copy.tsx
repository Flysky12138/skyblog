'use client'

import { Treaty } from '@elysiajs/eden'
import { useCopyToClipboard } from '@repo/react-hooks'
import { toast } from '@repo/ui/base'
import { Badge } from '@repo/ui/components/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@repo/ui/components/dropdown-menu'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@repo/ui/components/item'
import React from 'react'

import { FileHelper } from '@/lib/helper/file'
import { rpc } from '@/lib/http/rpc'

import { getPublicUrl } from './utils'

interface StorageFileLinkCopyProps {
  children: React.ReactElement
  file: Treaty.Data<ReturnType<typeof rpc.dashboard.storage.directories>['get']>['files'][number]
}

export function StorageFileLinkCopy({ children, file }: StorageFileLinkCopyProps) {
  const [_, copy] = useCopyToClipboard()

  const links = [{ label: '直链', value: getPublicUrl(file.s3Object.objectKey) }]

  switch (FileHelper.getFileType(file.mimeType)) {
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
      <DropdownMenuTrigger render={children} />
      <DropdownMenuContent align="end" className="w-full max-w-xs md:max-w-md">
        {links.map(({ label, value }, index) => (
          <DropdownMenuItem
            key={index}
            className="cursor-pointer"
            onClick={() => {
              copy(value)
              toast.success('复制成功')
            }}
          >
            <Item className="w-full p-1">
              <ItemContent>
                <ItemTitle>
                  <Badge className="rounded-sm text-primary-foreground!">{label}</Badge>
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
