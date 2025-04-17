'use client'

import { Pagination, PaginationProps } from '@/components/pagination'
import { cn } from '@/lib/cn'

export interface PostListPaginationProps extends Omit<PaginationProps, 'getHref'> {
  /**
   * 提供跳转链接模板；否则会自动在当前路由 `search` 里添加 `page` 字段进行跳转
   * @example
   * path="/pages/[page]"
   */
  path?: `${string}[page]${string}`
}

export const PostListPagination = ({ path, className, ...props }: PostListPaginationProps) => {
  return (
    <Pagination
      className={cn('[&_span]:hidden', className)}
      getHref={({ page }) => {
        if (path) {
          return path.replaceAll('[page]', String(page))
        }
        const url = new URL(window.location.href)
        url.searchParams.set('page', String(page))
        return url.href
      }}
      {...props}
    />
  )
}
