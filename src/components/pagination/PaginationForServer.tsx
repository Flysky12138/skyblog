'use client'

import { Pagination } from '@mui/material'
import { useRouter } from 'next/navigation'

export interface PaginationForServerProps {
  className?: string
  count: number
  page: number
  /**
   * 提供跳转链接模板；否则会自动在当前路由 `search` 里添加 `page` 字段进行跳转
   */
  path?: `${string}[page]${string}`
}

export default function PaginationForServer({ path, className, ...props }: PaginationForServerProps) {
  const router = useRouter()

  if (props.count <= 1) return null

  return (
    <Pagination
      className={className}
      onChange={(_, page) => {
        let href = ''
        if (path) {
          href = path.replace('[page]', page.toString())
        } else {
          const url = new URL(window.location.href)
          url.searchParams.set('page', page.toString())
          href = url.href
        }
        router.push(href, { scroll: true })
      }}
      {...props}
    />
  )
}
