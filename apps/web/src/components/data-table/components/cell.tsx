'use client'

import { Checkbox } from '@repo/ui/components/checkbox'

import { TimeHelper } from '@/lib/helper/time'

import { useCellContext, useTableContext } from '../hooks'

/**
 * 日期
 */
export function DataTableCellDate() {
  const cell = useCellContext<Date | string>()

  const date = cell.getValue()

  return date instanceof Date ? TimeHelper.formatDate(date) : date
}

/**
 * 行选择
 */
export function DataTableRowSelection() {
  const table = useTableContext()
  const cell = useCellContext()

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {() => (
        <Checkbox
          aria-label="选择行"
          checked={cell.row.getIsSelected()}
          disabled={!cell.row.getCanSelect()}
          onCheckedChange={() => {
            cell.row.toggleSelected()
          }}
        />
      )}
    </table.Subscribe>
  )
}
