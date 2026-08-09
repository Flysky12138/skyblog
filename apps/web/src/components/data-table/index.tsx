'use client'

import { Card } from '@repo/ui/components-self/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import { cn } from '@repo/ui/lib/utils'
import { SortDirection } from '@tanstack/react-table'
import { pick } from 'es-toolkit'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, LucideIcon } from 'lucide-react'
import React from 'react'

import { ColumnMeta, useHeaderContext, useTableContext } from './hooks'

interface DataTableProps {
  isLoading?: boolean
}

export function DataTable({ isLoading }: DataTableProps) {
  const table = useTableContext()

  return (
    <DataTableWrapper>
      <table.Subscribe selector={state => pick(state, ['pagination', 'sorting'])}>
        {() => (
          <Table
            className="min-w-full table-fixed"
            style={{
              width: table.getTotalSize()
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(h => (
                    <table.AppHeader key={h.id} header={h}>
                      {header => (
                        <TableHead
                          className={cn('', getAlignClassName(header.column.columnDef.meta?.align))}
                          colSpan={header.colSpan}
                          style={{
                            width: header.column.columnDef.meta?.autoWidth ? undefined : header.column.getSize()
                          }}
                        >
                          {header.isPlaceholder ? null : header.column.columnDef.meta?.enableSorting ? <RowsSort /> : <header.FlexRender />}
                        </TableHead>
                      )}
                    </table.AppHeader>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                    {row.getAllCells().map(c => (
                      <table.AppCell key={c.id} cell={c}>
                        {cell => (
                          <TableCell className={cn('', getAlignClassName(cell.column.columnDef.meta?.align))}>
                            <cell.FlexRender />
                          </TableCell>
                        )}
                      </table.AppCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length}>
                    <span className="sticky left-1/2 inline-block -translate-x-1/2">{isLoading ? 'Loading...' : 'No results.'}</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </table.Subscribe>
    </DataTableWrapper>
  )
}

export function DataTableWrapper({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card className={cn('overflow-hidden rounded-md dark:ring-0', '*:pointer-coarse:no-scrollbar **:[th]:border-b-2', className)} {...props} />
}

function getAlignClassName(align: ColumnMeta['align']) {
  switch (align) {
    case 'center':
      return cn('text-center')
    case 'end':
      return cn('text-end')
    case 'start':
      return cn('text-start')
    default:
      return ''
  }
}

/**
 * 表头排序按钮
 */
function RowsSort() {
  const table = useTableContext()
  const header = useHeaderContext()

  const record = React.useMemo<Record<'none' | SortDirection, { aria: React.AriaAttributes['aria-sort']; icon: LucideIcon; handler: () => void }>>(
    () => ({
      asc: { aria: 'ascending', icon: ArrowUpIcon, handler: () => header.column.clearSorting() },
      desc: { aria: 'descending', icon: ArrowDownIcon, handler: () => header.column.toggleSorting(false) },
      none: { aria: 'none', icon: ChevronsUpDownIcon, handler: () => header.column.toggleSorting(true) }
    }),
    [header.column]
  )

  return (
    <table.Subscribe source={table.atoms.sorting}>
      {() => {
        if (!header.column.getCanSort()) {
          return <header.FlexRender />
        }

        const { aria, handler, icon: Icon } = record[header.column.getIsSorted() || 'none']

        return (
          <button aria-sort={aria} className="flex items-center gap-1.5 select-none focus-visible:ring-3 *:[svg]:size-4" onClick={handler}>
            <header.FlexRender />
            <Icon />
          </button>
        )
      }}
    </table.Subscribe>
  )
}
