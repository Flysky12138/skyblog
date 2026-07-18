'use client'

import { ButtonLink } from '@repo/ui/components/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { Route } from 'next'
import { usePathname, useSearchParams } from 'next/navigation'
import { PageNumberPaginationMeta } from 'prisma-extension-pagination'
import React from 'react'

import { Show } from '@/components/show'

export interface PostPaginationProps extends PageNumberPaginationMeta<true> {}

export function PostPagination({ currentPage, pageCount }: PostPaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { next, prev } = React.useMemo(() => {
    let prev: null | Route = null
    let next: null | Route = null

    if (currentPage !== 1) {
      const params = new URLSearchParams(searchParams)
      params.set('page', String(currentPage - 1))
      params.sort()
      prev = pathname + '?' + params.toString()
    }
    if (currentPage !== pageCount) {
      const params = new URLSearchParams(searchParams)
      params.set('page', String(currentPage + 1))
      params.sort()
      next = pathname + '?' + params.toString()
    }

    return { next, prev }
  }, [currentPage, pageCount, pathname, searchParams])

  return (
    <Show when={!!prev || !!next}>
      <div className="grid grid-cols-2">
        {prev && (
          <ButtonLink className="justify-self-start" href={prev} variant="outline">
            <ArrowLeftIcon /> 上一页
          </ButtonLink>
        )}
        {next && (
          <ButtonLink className="col-start-2 justify-self-end" href={next} variant="outline">
            下一页 <ArrowRightIcon />
          </ButtonLink>
        )}
      </div>
    </Show>
  )
}
