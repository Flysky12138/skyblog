'use client'

import { PaginationResult } from 'prisma-paginate'
import * as PaginationPrimitive from 'ui/pagination'

export interface PaginationProps extends Partial<Pick<PaginationResult<unknown[]>, 'count' | 'limit' | 'page' | 'totalPages'>> {
  /**
   * 开头和结尾始终可见的页数
   * @default 1
   */
  boundaryCount?: number
  className?: string
  /**
   * 当前页面之前和之后始终可见的页面数
   * @default 2
   */
  siblingCount?: number
  getHref?: (payload: Pick<PaginationResult<unknown[]>, 'count' | 'limit' | 'page' | 'totalPages'>) => string
  onChange?: (payload: Pick<PaginationResult<unknown[]>, 'count' | 'limit' | 'page' | 'totalPages'>) => void
}

const Pagination = ({
  boundaryCount = 1,
  className,
  count = 1,
  getHref,
  limit = 1,
  page = 1,
  siblingCount = 2,
  totalPages = 1,
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
          {(page - 1) * limit + 1}-{page * limit} of {count} rows
        </span>
        <PaginationPrimitive.PaginationItem>
          <PaginationPrimitive.PaginationPrevious
            disabled={page <= 1}
            href={getHref?.({ count, limit, page: page - 1, totalPages })}
            size="sm"
            onClick={() => {
              onChange?.({ count, limit, page: page - 1, totalPages })
            }}
          />
        </PaginationPrimitive.PaginationItem>
        {itemList.map(it =>
          typeof it == 'number' ? (
            <PaginationPrimitive.PaginationItem key={it}>
              <PaginationPrimitive.PaginationLink
                href={getHref?.({ count, limit, page: it, totalPages })}
                isActive={it == page}
                size="sm"
                onClick={() => {
                  onChange?.({ count, limit, page: it, totalPages })
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
        <PaginationPrimitive.PaginationItem>
          <PaginationPrimitive.PaginationNext
            disabled={page >= totalPages}
            href={getHref?.({ count, limit, page: page + 1, totalPages })}
            size="sm"
            onClick={() => {
              onChange?.({ count, limit, page: page + 1, totalPages })
            }}
          />
        </PaginationPrimitive.PaginationItem>
      </PaginationPrimitive.PaginationContent>
    </PaginationPrimitive.Pagination>
  )
}

export { Pagination }
