'use client'

import { RowData, Table } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

const pageSizes = [10, 20, 25, 30, 40, 50, 100]

interface DataTablePaginationProps<TData extends RowData> {
  className?: string
  table: Table<TData>
}

export function DataTablePagination<TData extends RowData>({ className, table }: DataTablePaginationProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  return (
    <div className={cn('flex items-center gap-6 lg:gap-8', className)}>
      <Select
        disabled={table.options.meta?.isLoading}
        items={pageSizes.map(item => ({ label: `${item} 条/页`, value: item }))}
        value={table.getState().pagination.pageSize}
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
          <SelectValue placeholder={table.getState().pagination.pageSize} />
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
          disabled={!table.getCanPreviousPage() || table.options.meta?.isLoading}
          size="icon-sm"
          variant="outline"
          onClick={() => {
            table.setPageIndex(0)
          }}
        >
          <span className="sr-only">第一页</span>
          <ChevronsLeftIcon />
        </Button>
        <Button
          disabled={!table.getCanPreviousPage() || table.options.meta?.isLoading}
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
          {table.options.meta?.isLoading ? <Spinner /> : `${table.getState().pagination.pageIndex + 1} / ${table.getPageCount()}`}
        </Button>
        <Button
          disabled={!table.getCanNextPage() || table.options.meta?.isLoading}
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
          disabled={!table.getCanNextPage() || table.options.meta?.isLoading}
          size="icon-sm"
          variant="outline"
          onClick={() => {
            table.setPageIndex(table.getPageCount() - 1)
          }}
        >
          <span className="sr-only">最后一页</span>
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  )
}
