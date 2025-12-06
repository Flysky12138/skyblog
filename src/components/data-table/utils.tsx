import { ColumnDef, RowData } from '@tanstack/react-table'
import { merge } from 'es-toolkit'

import { Checkbox } from '@/components/ui/checkbox'
import { formatISOTime } from '@/lib/parser/time'

import { DataTableColumnSortHeader } from './data-table-column-header'

type ColumnAccessorKey = 'createdAt' | 'index' | 'selection' | 'updatedAt'

/**
 * 获取列配置
 */
export const getColumnConfig = <TData extends RowData>(accessorKey: ColumnAccessorKey, options?: ColumnDef<TData>): ColumnDef<TData> => {
  switch (accessorKey) {
    case 'createdAt':
      return merge(
        {
          accessorKey: 'createdAt',
          size: 180,
          cell: ({ row }) => formatISOTime((row.original as any)['createdAt']),
          header: ({ column }) => <DataTableColumnSortHeader column={column} title="创建时间" />
        } satisfies ColumnDef<TData>,
        options ?? {}
      )
    case 'index':
      return merge(
        {
          header: '#',
          id: 'index',
          size: 42,
          cell: ({ row }) => row.index + 1
        } satisfies ColumnDef<TData>,
        options ?? {}
      )
    case 'selection':
      return merge(
        {
          id: 'selection',
          size: 40,
          cell: ({ row }) => <Checkbox aria-label="选择行" checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} />,
          header: ({ table }) => (
            <Checkbox
              aria-label="选择所有行"
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
              onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
            />
          )
        } satisfies ColumnDef<TData>,
        options ?? {}
      )
    case 'updatedAt':
      return merge(
        {
          accessorKey: 'updatedAt',
          size: 180,
          cell: ({ row }) => formatISOTime((row.original as any)['updatedAt']),
          header: ({ column }) => <DataTableColumnSortHeader column={column} title="更新时间" />
        } satisfies ColumnDef<TData>,
        options ?? {}
      )
  }
}
