import { ColumnDef, RowData } from '@tanstack/react-table'
import { merge } from 'es-toolkit'

import { Checkbox } from '@/components/ui/checkbox'
import { TimeHelper } from '@/lib/helper/time'

import { DataTableColumnSortHeader } from './data-table-column-header'

type ColumnAccessorKey = 'createdAt' | 'index' | 'selection' | 'updatedAt'

/**
 * 获取列配置
 */
export const getColumnConfig = <T extends RowData>(accessorKey: ColumnAccessorKey, options?: ColumnDef<T>): ColumnDef<T> => {
  switch (accessorKey) {
    case 'createdAt':
      return merge(
        {
          accessorKey: 'createdAt',
          size: 180,
          cell: ({ row }) => TimeHelper.formatDate((row.original as any)['createdAt']),
          header: ({ column }) => <DataTableColumnSortHeader column={column} title="创建时间" />
        } satisfies ColumnDef<T>,
        options ?? {}
      )
    case 'index':
      return merge(
        {
          header: '#',
          id: 'index',
          size: 42,
          cell: ({ row }) => row.index + 1
        } satisfies ColumnDef<T>,
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
        } satisfies ColumnDef<T>,
        options ?? {}
      )
    case 'updatedAt':
      return merge(
        {
          accessorKey: 'updatedAt',
          size: 180,
          cell: ({ row }) => TimeHelper.formatDate((row.original as any)['updatedAt']),
          header: ({ column }) => <DataTableColumnSortHeader column={column} title="更新时间" />
        } satisfies ColumnDef<T>,
        options ?? {}
      )
  }
}
