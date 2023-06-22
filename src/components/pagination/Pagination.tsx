'use client'

import { Pagination as MuiPagination } from '@mui/material'
import { useRouter } from 'next/navigation'

interface PaginationProps {
  className?: string
  count: number
  page: number
  path?: `${string}[page]${string}`
}

export default function Pagination({ path, className, ...props }: PaginationProps) {
  const router = useRouter()

  if (props.count <= 1) return null

  return (
    <MuiPagination
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
