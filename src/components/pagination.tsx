'use client'

import * as PaginationPrimitive from '@/components/ui/pagination'
import { cn } from '@/lib/cn'
import { PaginationArgs, PaginationResult } from 'prisma-paginate'

export interface PaginationProps extends Partial<Pick<PaginationResult, 'count' | 'limit' | 'page' | 'totalPages'>> {
  /**
   * 开头和结尾始终可见的页数
   * @default 1
   */
  boundaryCount?: number
  className?: string
  onChange?: (payload: PaginationArgs) => void
  /**
   * 当前页面之前和之后始终可见的页面数
   * @default 2
   */
  siblingCount?: number
}

export const Pagination = ({
  count = 1,
  limit = 1,
  page = 1,
  totalPages = 1,
  boundaryCount = 1,
  className,
  siblingCount = 2,
  onChange
}: PaginationProps) => {
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const siblingsStart = Math.max(Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2)
  const siblingsEnd = Math.min(Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2), totalPages - boundaryCount - 1)

  /**
   * @see https://github.com/mui/material-ui/blob/master/packages/mui-material/src/usePagination/usePagination.js
   */
  const itemList = [
    ...range(1, Math.min(boundaryCount, totalPages)),
    ...(siblingsStart > boundaryCount + 2 ? ['start-ellipsis'] : boundaryCount + 1 < totalPages - boundaryCount ? [boundaryCount + 1] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPages - boundaryCount - 1
      ? ['end-ellipsis']
      : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : []),
    ...range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages)
  ]

  return (
    <PaginationPrimitive.Pagination className={className}>
      <PaginationPrimitive.PaginationContent>
        <span className="mr-4 pb-0.5 text-sm opacity-75">
          {(page - 1) * limit + 1}-{page * limit} of {count} items
        </span>
        <PaginationPrimitive.PaginationItem
          className={cn('cursor-pointer select-none', {
            'cursor-not-allowed opacity-50': page <= 1
          })}
        >
          <PaginationPrimitive.PaginationPrevious
            size="sm"
            onClick={() => {
              if (page <= 1) return
              onChange?.({ limit, page: page - 1 })
            }}
          />
        </PaginationPrimitive.PaginationItem>
        {itemList.map(it =>
          typeof it == 'number' ? (
            <PaginationPrimitive.PaginationItem key={it} className="cursor-pointer select-none">
              <PaginationPrimitive.PaginationLink
                isActive={it == page}
                size="sm"
                onClick={() => {
                  onChange?.({ limit, page: it })
                }}
              >
                {it}
              </PaginationPrimitive.PaginationLink>
            </PaginationPrimitive.PaginationItem>
          ) : (
            <PaginationPrimitive.PaginationItem key={it}>
              <PaginationPrimitive.PaginationEllipsis />
            </PaginationPrimitive.PaginationItem>
          )
        )}
        <PaginationPrimitive.PaginationItem
          className={cn('cursor-pointer select-none', {
            'cursor-not-allowed opacity-50': page >= totalPages
          })}
        >
          <PaginationPrimitive.PaginationNext
            size="sm"
            onClick={() => {
              if (page >= totalPages) return
              onChange?.({ limit, page: page + 1 })
            }}
          />
        </PaginationPrimitive.PaginationItem>
      </PaginationPrimitive.PaginationContent>
    </PaginationPrimitive.Pagination>
  )
}
