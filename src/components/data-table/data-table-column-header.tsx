'use client'

import { Column } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react'

export function DataTableColumnSortHeader<TData, TValue>({ column, title }: { column: Column<TData, TValue>; title: string }) {
  if (!column.getCanSort()) {
    return title
  }

  const sortState = column.getIsSorted()

  return (
    <button
      className="flex items-center gap-1.5 select-none focus-visible:ring-3 *:[svg]:size-4"
      onClick={() => {
        switch (sortState) {
          case 'asc':
            column.clearSorting()
            break
          case 'desc':
            column.toggleSorting(false)
            break
          default:
            column.toggleSorting(true)
        }
      }}
    >
      <span>{title}</span>
      {sortState == 'desc' ? <ArrowDownIcon /> : sortState == 'asc' ? <ArrowUpIcon /> : <ChevronsUpDownIcon />}
    </button>
  )
}
