'use client'

import { Button } from '@repo/ui/components/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select'
import { Spinner } from '@repo/ui/components/spinner'
import { cn } from '@repo/ui/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'

import { useTableContext } from '../hooks'

const pageSizes = [10, 15, 20, 25, 30, 40, 50, 100]

interface DataTablePaginationProps {
  className?: string
  isLoading?: boolean
}

export function DataTablePagination({ className, isLoading }: DataTablePaginationProps) {
  const table = useTableContext()

  return (
    <table.Subscribe source={table.atoms.pagination}>
      {({ pageIndex, pageSize }) => {
        const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

        return (
          <div className={cn('flex items-center gap-6 lg:gap-8', className)}>
            <Select
              disabled={isLoading}
              items={pageSizes.map(item => ({ label: `${item} 条/页`, value: item }))}
              value={pageSize}
              onValueChange={value => {
                if (!value) return
                table.setPageSize(value)
              }}
            >
              <SelectTrigger
                className={cn('w-28', {
                  'not-sm:hidden': selectedRows.length > 0
                })}
                size="sm"
              >
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {pageSizes.map(pageSize => (
                    <SelectItem key={pageSize} value={pageSize}>
                      {pageSize} 条/页
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                className="hidden lg:flex"
                disabled={!table.getCanPreviousPage() || isLoading}
                size="icon-sm"
                variant="outline"
                onClick={() => {
                  table.firstPage()
                }}
              >
                <span className="sr-only">第一页</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                disabled={!table.getCanPreviousPage() || isLoading}
                size="icon-sm"
                variant="outline"
                onClick={() => {
                  table.previousPage()
                }}
              >
                <span className="sr-only">上一页</span>
                <ChevronLeftIcon />
              </Button>
              <Button className="pointer-events-none h-8 cursor-default" nativeButton={false} render={<span />} variant="secondary">
                {isLoading ? <Spinner /> : `${pageIndex + 1} / ${table.getPageCount()}`}
              </Button>
              <Button
                disabled={!table.getCanNextPage() || isLoading}
                size="icon-sm"
                variant="outline"
                onClick={() => {
                  table.nextPage()
                }}
              >
                <span className="sr-only">下一页</span>
                <ChevronRightIcon />
              </Button>
              <Button
                className="hidden lg:flex"
                disabled={!table.getCanNextPage() || isLoading}
                size="icon-sm"
                variant="outline"
                onClick={() => {
                  table.lastPage()
                }}
              >
                <span className="sr-only">最后一页</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        )
      }}
    </table.Subscribe>
  )
}
