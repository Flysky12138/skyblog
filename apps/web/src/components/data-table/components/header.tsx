'use client'

import { Checkbox } from '@repo/ui/components/checkbox'
import { pick } from 'es-toolkit'

import { useTableContext } from '../hooks'

/**
 * 表头行选择
 */
export function DataTableRowsSelection() {
  const table = useTableContext()

  return (
    <table.Subscribe selector={state => pick(state, ['pagination', 'rowSelection'])}>
      {() => (
        <Checkbox
          aria-label="选择所有行"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={() => {
            table.toggleAllPageRowsSelected()
          }}
        />
      )}
    </table.Subscribe>
  )
}
