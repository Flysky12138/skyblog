'use client'

import { ColumnMeta, flexRender, RowData, Table as TableType } from '@tanstack/react-table'

import { Card } from '@/components/static/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, tw } from '@/lib/utils'

interface DataTableProps<TData extends RowData> {
  table: TableType<TData>
}

export function DataTable<TData extends RowData>({ table }: DataTableProps<TData>) {
  return (
    <DataTableWrapper>
      <Table
        className="min-w-full"
        style={{
          width: table.getTotalSize()
        }}
      >
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className={cn('', getAlignClassName(header.column.columnDef.meta?.align))}
                  colSpan={header.colSpan}
                  style={{
                    width: header.column.columnDef.meta?.widthFit ? 'fit-content' : header.column.getSize()
                  }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className={cn('', getAlignClassName(cell.column.columnDef.meta?.align))}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={table.getAllColumns().length}>
                {table.options.meta?.isLoading ? 'Loading...' : 'No results.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DataTableWrapper>
  )
}

export function DataTableWrapper({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn('overflow-hidden rounded-sm border-none shadow-sm', '*:pointer-coarse:no-scrollbar', '**:[th]:border-b-2', className)}
      {...props}
    />
  )
}

const getAlignClassName = <TData extends RowData, TValue>(align: ColumnMeta<TData, TValue>['align']) => {
  switch (align) {
    case 'center':
      return tw`text-center`
    case 'end':
      return tw`text-end`
    case 'start':
      return tw`text-start`
    default:
      return ''
  }
}
