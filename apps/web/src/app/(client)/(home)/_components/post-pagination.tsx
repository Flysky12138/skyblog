import { ButtonLink } from '@repo/components/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { PageNumberPaginationMeta } from 'prisma-extension-pagination'

export interface PostPaginationProps extends PageNumberPaginationMeta<true> {
  searchParams: PageProps<'/'>['searchParams']
}

export async function PostPagination({ currentPage, pageCount, searchParams }: PostPaginationProps) {
  const search = new URLSearchParams((await searchParams) as {})

  let prevSearch: null | string = null
  let nextSearch: null | string = null

  if (currentPage > 1) {
    search.set('page', String(currentPage - 1))
    search.sort()
    prevSearch = search.toString()
  }
  if (currentPage < pageCount) {
    search.set('page', String(currentPage + 1))
    search.sort()
    nextSearch = search.toString()
  }

  if (!prevSearch && !nextSearch) return null

  return (
    <div className="grid grid-cols-2">
      {prevSearch && (
        <ButtonLink className="justify-self-start" href={{ search: prevSearch }} variant="outline">
          <ArrowLeftIcon /> 上一页
        </ButtonLink>
      )}
      {nextSearch && (
        <ButtonLink className="col-start-2 justify-self-end" href={{ search: nextSearch }} variant="outline">
          下一页 <ArrowRightIcon />
        </ButtonLink>
      )}
    </div>
  )
}
