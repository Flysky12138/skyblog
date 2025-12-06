'use client'

import { RowData, Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface DataTablePaginationProps<TData extends RowData> {
  className?: string
  table: Table<TData>
}

export function DataTablePagination<TData extends RowData>({ className, table }: DataTablePaginationProps<TData>) {
  return (
    <div className={cn('flex items-center gap-6 lg:gap-8', className)}>
      <Select
        disabled={table.options.meta?.isLoading}
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={value => {
          table.setPageSize(Number(value))
        }}
      >
        <SelectTrigger className="h-8! w-28">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {[10, 20, 25, 30, 40, 50, 100].map(pageSize => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize} 条/页
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Button
          className="hidden lg:flex"
          disabled={!table.getCanPreviousPage() || table.options.meta?.isLoading}
          size="icon-sm"
          variant="outline"
          onClick={() => table.setPageIndex(0)}
        >
          <span className="sr-only">第一页</span>
          <ChevronsLeft />
        </Button>
        <Button
          disabled={!table.getCanPreviousPage() || table.options.meta?.isLoading}
          size="icon-sm"
          variant="outline"
          onClick={() => table.previousPage()}
        >
          <span className="sr-only">上一页</span>
          <ChevronLeft />
        </Button>
        <Button asChild className="pointer-events-none h-8 cursor-default" variant="secondary">
          <span>{table.options.meta?.isLoading ? <Spinner /> : `${table.getState().pagination.pageIndex + 1} / ${table.getPageCount()}`}</span>
        </Button>
        <Button disabled={!table.getCanNextPage() || table.options.meta?.isLoading} size="icon-sm" variant="outline" onClick={() => table.nextPage()}>
          <span className="sr-only">下一页</span>
          <ChevronRight />
        </Button>
        <Button
          className="hidden lg:flex"
          disabled={!table.getCanNextPage() || table.options.meta?.isLoading}
          size="icon-sm"
          variant="outline"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        >
          <span className="sr-only">最后一页</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  )
}
