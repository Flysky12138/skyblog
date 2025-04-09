'use client'

import { Pagination, PaginationProps } from '@/components/pagination'
import { cn } from '@/lib/cn'
import { useRouter } from 'nextjs-toploader/app'

export interface PostListPaginationProps extends Omit<PaginationProps, 'onChange'> {
  /**
   * 提供跳转链接模板；否则会自动在当前路由 `search` 里添加 `page` 字段进行跳转
   * @example
   * path="/pages/[page]"
   */
  path?: `${string}[page]${string}`
}

export const PostListPagination = ({ path, className, ...props }: PostListPaginationProps) => {
  const router = useRouter()

  return (
    <Pagination
      className={cn('[&_span]:hidden', className)}
      {...props}
      onChange={({ page }) => {
        let href = ''
        if (path) {
          href = path.replaceAll('[page]', String(page))
        } else {
          const url = new URL(window.location.href)
          url.searchParams.set('page', String(page))
          href = url.href
        }
        router.push(href, { scroll: true })
      }}
    />
  )
}
