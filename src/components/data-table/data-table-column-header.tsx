'use client'

import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

export function DataTableColumnSortHeader<TData, TValue>({ column, title }: { column: Column<TData, TValue>; title: string }) {
  if (!column.getCanSort()) {
    return title
  }

  const sortState = column.getIsSorted()

  return (
    <div
      className="flex items-center gap-1.5 select-none *:[svg]:size-4"
      role="button"
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
      {sortState == 'desc' ? <ArrowDown /> : sortState == 'asc' ? <ArrowUp /> : <ChevronsUpDown />}
    </div>
  )
}
