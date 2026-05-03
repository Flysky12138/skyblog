'use client'

import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { PostSearchParamsType } from '../utils'

const items: { label: string; value: PostSearchParamsType['sortord'] }[] = [
  { label: '创建时间', value: 'createdAt' },
  { label: '更新时间', value: 'updatedAt' },
  { label: '浏览次数', value: 'viewCount' }
]

interface PostSortProps {
  className?: string
  order: PostSearchParamsType['order']
  sortord: PostSearchParamsType['sortord']
}

export function PostSort({ className, order, sortord }: PostSortProps) {
  const router = useRouter()

  const handleClick = React.useEffectEvent(({ order, sortord }: RequiredPick<PostSortProps, 'order' | 'sortord'>) => {
    const url = new URL(window.location.href)
    url.searchParams.set('order', order)
    url.searchParams.set('sortord', sortord)
    router.push(url.href)
  })

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                handleClick({ order: order == 'desc' ? 'asc' : 'desc', sortord })
              }}
            />
          }
        >
          {order == 'desc' ? <ArrowDownWideNarrowIcon /> : <ArrowDownNarrowWideIcon />}
        </TooltipTrigger>
        <TooltipContent>{order == 'desc' ? '降序' : '升序'}</TooltipContent>
      </Tooltip>

      <Select
        items={items}
        value={sortord}
        onValueChange={value => {
          if (!value) return
          handleClick({ order, sortord: value })
        }}
      >
        <SelectTrigger render={({ className, ...props }) => <Button className="w-32" variant="outline" {...props} />}>
          <SelectValue placeholder="排序方式" />
        </SelectTrigger>
        <SelectContent className="min-w-0">
          <SelectGroup>
            {items.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
