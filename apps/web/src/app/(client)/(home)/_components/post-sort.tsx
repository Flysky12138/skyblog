'use client'

import { Button } from '@repo/ui/components/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select'
import { cn } from '@repo/ui/lib/utils'
import { ArrowDownNarrowWideIcon, ArrowDownWideNarrowIcon } from 'lucide-react'
import { useRouter } from 'nextjs-toploader/app'

import { PostSearchParamsType } from '../utils'

const items: { label: string; value: PostSearchParamsType['field'] }[] = [
  { label: '创建时间', value: 'createdAt' },
  { label: '更新时间', value: 'updatedAt' },
  { label: '浏览次数', value: 'viewCount' }
]

interface PostSortProps {
  className?: string
  direction: PostSearchParamsType['direction']
  field: PostSearchParamsType['field']
}

export function PostSort({ className, direction, field }: PostSortProps) {
  const router = useRouter()

  const handleClick = ({ direction, field }: RequiredPick<PostSortProps, 'direction' | 'field'>) => {
    const url = new URL(window.location.href)
    url.searchParams.set('field', field)
    url.searchParams.set('direction', direction)
    router.push(url.href)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        size="icon"
        variant="outline"
        onClick={() => {
          handleClick({ direction: direction === 'desc' ? 'asc' : 'desc', field })
        }}
      >
        {direction === 'desc' ? <ArrowDownWideNarrowIcon /> : <ArrowDownNarrowWideIcon />}
      </Button>

      <Select
        items={items}
        value={field}
        onValueChange={value => {
          if (!value) return
          handleClick({ direction, field: value })
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
