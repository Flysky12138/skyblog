'use client'

import { isFunction, isNull } from 'es-toolkit'
import { PaginationResult } from 'prisma-paginate'
import React from 'react'

import * as PaginationPrimitive from '@/components/ui-overwrite/pagination'

export interface PaginationProps extends Partial<Pick<PaginationResult<unknown[]>, 'count' | 'limit' | 'page'>> {
  /**
   * 开头和结尾始终可见的页数
   * @default 1
   */
  boundaryCount?: number
  className?: string
  /** 只有一页时是否隐藏分页器 */
  hideOnSinglePage?: boolean
  /**
   * 用于显示数据总量和当前数据范围，默认显示
   * @example
   * null // 不显示
   */
  showTotal?: ((total: number, range: [number, number]) => React.ReactNode) | null
  /**
   * 当前页面之前和之后始终可见的页面数
   * @default 2
   */
  siblingCount?: number
  /**
   * 获取跳转链接
   * @description 默认使用 `button` 标签，当有返回值时使用 `next/link` 标签
   */
  getHref?: (payload: Pick<PaginationResult<unknown[]>, 'count' | 'limit' | 'page' | 'totalPages'>) => string
  onChange?: (payload: Pick<PaginationResult<unknown[]>, 'count' | 'limit' | 'page' | 'totalPages'>) => void
}

export const Pagination = ({
  boundaryCount = 1,
  className,
  count = 1,
  getHref,
  hideOnSinglePage,
  limit = 1,
  page = 1,
  showTotal,
  siblingCount = 2,
  onChange
}: PaginationProps) => {
  /** 总页数 */
  const totalPages = Math.ceil(count / limit)

  if (hideOnSinglePage && totalPages <= 1) return null

  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const siblingsStart = Math.max(Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2)
  const siblingsEnd = Math.min(Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2), totalPages - boundaryCount - 1)

  /**
   * 计算分页组件的页码
   * @see https://github.com/mui/material-ui/blob/master/packages/mui-material/src/usePagination/usePagination.js
   */
  const itemList = [
    ...range(1, Math.min(boundaryCount, totalPages)),
    ...(siblingsStart > boundaryCount + 2 ? ['start-ellipsis' as const] : boundaryCount + 1 < totalPages - boundaryCount ? [boundaryCount + 1] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPages - boundaryCount - 1
      ? ['end-ellipsis' as const]
      : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : []),
    ...range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages)
  ] satisfies ('end-ellipsis' | 'start-ellipsis' | number)[]

  return (
    <PaginationPrimitive.Pagination className={className}>
      <PaginationPrimitive.PaginationContent>
        <span className="mr-4 pb-0.5 text-sm opacity-75 empty:hidden">
          {isFunction(showTotal)
            ? showTotal(count, [(page - 1) * limit + 1, page * limit])
            : isNull(showTotal)
              ? null
              : `${(page - 1) * limit + 1}-${page * limit} of ${count} rows`}
        </span>
        <PaginationPrimitive.PaginationItem>
          <PaginationPrimitive.PaginationPrevious
            disabled={page <= 1}
            href={getHref?.({ count, limit, page: page - 1, totalPages })}
            onClick={() => {
              onChange?.({ count, limit, page: page - 1, totalPages })
            }}
          />
        </PaginationPrimitive.PaginationItem>
        {itemList.map(item => (
          <PaginationPrimitive.PaginationItem key={item}>
            {typeof item == 'number' ? (
              <PaginationPrimitive.PaginationLink
                href={getHref?.({ count, limit, page: item, totalPages })}
                isActive={item == page}
                onClick={() => {
                  onChange?.({ count, limit, page: item, totalPages })
                }}
              >
                {item}
              </PaginationPrimitive.PaginationLink>
            ) : (
              <PaginationPrimitive.PaginationEllipsis />
            )}
          </PaginationPrimitive.PaginationItem>
        ))}
        <PaginationPrimitive.PaginationItem>
          <PaginationPrimitive.PaginationNext
            disabled={page >= totalPages}
            href={getHref?.({ count, limit, page: page + 1, totalPages })}
            onClick={() => {
              onChange?.({ count, limit, page: page + 1, totalPages })
            }}
          />
        </PaginationPrimitive.PaginationItem>
      </PaginationPrimitive.PaginationContent>
    </PaginationPrimitive.Pagination>
  )
}
