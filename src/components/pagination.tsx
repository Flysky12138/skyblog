'use client'

import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationPrimitive
} from '@/components/ui/pagination'
import { cn } from '@/lib/cn'
import { PaginationArgs, PaginationResult } from 'prisma-paginate'

export interface PaginationProps extends Partial<Pick<PaginationResult, 'count' | 'limit' | 'page' | 'totalPages'>> {
  /**
   * 开头和结尾始终可见的页数
   */
  boundaryCount?: number
  className?: string
  onChange?: (payload: PaginationArgs) => void
  /**
   * 当前页面之前和之后始终可见的页面数
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
  siblingCount = 1,
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
    <PaginationPrimitive className={className}>
      <PaginationContent>
        <span className="mr-4 pb-0.5 text-sm opacity-75">
          {(page - 1) * limit + 1}-{page * limit} of {count} items
        </span>
        <PaginationItem
          className={cn('cursor-pointer select-none', {
            'cursor-not-allowed opacity-50': page <= 1
          })}
        >
          <PaginationPrevious
            size="sm"
            onClick={() => {
              if (page <= 1) return
              onChange?.({ limit, page: page - 1 })
            }}
          />
        </PaginationItem>
        {itemList.map(it =>
          typeof it == 'number' ? (
            <PaginationItem key={it} className="cursor-pointer select-none">
              <PaginationLink
                isActive={it == page}
                size="sm"
                onClick={() => {
                  onChange?.({ limit, page: it })
                }}
              >
                {it}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={it}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}
        <PaginationItem
          className={cn('cursor-pointer select-none', {
            'cursor-not-allowed opacity-50': page >= totalPages
          })}
        >
          <PaginationNext
            size="sm"
            onClick={() => {
              if (page >= totalPages) return
              onChange?.({ limit, page: page + 1 })
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationPrimitive>
  )
}
