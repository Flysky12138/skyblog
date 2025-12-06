'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import { PageNumberPaginationMeta } from 'prisma-extension-pagination'
import React from 'react'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Button } from '@/components/ui/button'

export interface PostPaginationProps extends PageNumberPaginationMeta<true> {}

export function PostPagination({ currentPage, pageCount }: PostPaginationProps) {
  const [href, setHref] = React.useState<string>(process.env.NEXT_PUBLIC_WEBSITE_URL)

  const { next, prev } = React.useMemo(() => {
    let prev: null | Route = null
    let next: null | Route = null

    const url = new URL(href)
    if (currentPage != 1) {
      url.searchParams.set('page', String(currentPage - 1))
      prev = url.href
    }
    if (currentPage != pageCount) {
      url.searchParams.set('page', String(currentPage + 1))
      next = url.href
    }

    return { next, prev }
  }, [currentPage, href, pageCount])

  React.useEffect(() => {
    setHref(window.location.href)
  }, [])

  return (
    <DisplayByConditional condition={!!prev || !!next}>
      <div className="grid grid-cols-2">
        {prev && (
          <Button asChild className="justify-self-start" variant="outline">
            <Link href={prev}>
              <ArrowLeft /> 上一页
            </Link>
          </Button>
        )}
        {next && (
          <Button asChild className="col-start-2 justify-self-end" variant="outline">
            <Link href={next}>
              下一页 <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </DisplayByConditional>
  )
}
