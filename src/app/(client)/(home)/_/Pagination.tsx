'use client'

import { Pagination as MuiPagination } from '@mui/material'
import { useRouter } from 'next/navigation'

interface PaginationProps {
  count: number
  page: number
  pathname: string
}

export default function Pagination({ count, page: _page, pathname }: PaginationProps) {
  const router = useRouter()

  // React.useEffect(() => {
  //   window.scrollTo({ top: 0 })
  // }, [_page])

  if (count <= 1) return null

  return (
    <MuiPagination
      className="mx-auto"
      count={count}
      page={_page}
      onChange={(_, page) => {
        router.push(pathname + page)
      }}
    />
  )
}
