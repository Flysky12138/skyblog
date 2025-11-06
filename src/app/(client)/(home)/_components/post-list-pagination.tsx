'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import React from 'react'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Button } from '@/components/ui/button'

export interface PostListPaginationProps {
  page: number
  /**
   * 提供跳转链接模板；否则会自动在当前路由 `search` 里添加 `page` 字段进行跳转
   * @example
   * path="/pages/[page]"
   */
  path?: `${string}[page]${string}`
  totalPages: number
}

export const PostListPagination = ({ page, path, totalPages }: PostListPaginationProps) => {
  const { next, prev } = React.useMemo(() => {
    let [prev, next]: [null | string, null | string] = [null, null]
    if (path) {
      if (page != 1) {
        prev = path.replaceAll('[page]', String(page - 1))
      }
      if (page != totalPages) {
        next = path.replaceAll('[page]', String(page + 1))
      }
    } else {
      const url = new URL(window.location.href)
      if (page != 1) {
        url.searchParams.set('page', String(page - 1))
        prev = url.href
      }
      if (page != totalPages) {
        url.searchParams.set('page', String(page + 1))
        next = url.href
      }
    }
    return {
      next,
      prev
    }
  }, [page, path, totalPages])

  return (
    <DisplayByConditional condition={!!prev || !!next}>
      <div className="grid grid-cols-2">
        {prev && (
          <Button asChild className="justify-self-start" variant="outline">
            <Link href={prev as Route}>
              <ArrowLeft /> 上一页
            </Link>
          </Button>
        )}
        {next && (
          <Button asChild className="col-start-2 justify-self-end" variant="outline">
            <Link href={next as Route}>
              下一页 <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </DisplayByConditional>
  )
}
