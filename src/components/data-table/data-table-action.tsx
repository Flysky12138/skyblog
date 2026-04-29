'use client'

import { RowData, Table } from '@tanstack/react-table'
import { TrashIcon } from 'lucide-react'
import React from 'react'
import { useAsyncFn } from 'react-use'

import { AlertDelete, AlertDeleteProps } from '@/components/alert-delete'
import { Button } from '@/components/ui-overwrite/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function DataTableRowActionButton({
  className,
  tooltip,
  ...props
}: React.ComponentProps<typeof Button> & {
  tooltip?: React.ComponentProps<typeof TooltipContent> | string
}) {
  const button = (
    <Button className={cn('size-7 rounded-sm border not-hover:border-transparent', className)} size="icon" variant="secondary" {...props} />
  )

  if (!tooltip) return button

  if (typeof tooltip == 'string') {
    tooltip = {
      children: tooltip
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent {...tooltip} />
    </Tooltip>
  )
}

export function DataTableRowDeleteButton({ disabled, onConfirm, ...props }: AlertDeleteProps & { disabled?: boolean }) {
  const [{ loading }, handleConfirm] = useAsyncFn(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      await onConfirm(event)
    },
    [onConfirm]
  )

  return (
    <AlertDelete disabled={loading} onConfirm={handleConfirm} {...props}>
      <DataTableRowActionButton className="border-0!" disabled={disabled} loading={loading} variant="destructive">
        <TrashIcon />
      </DataTableRowActionButton>
    </AlertDelete>
  )
}

export function DataTableRowsDeleteButton<TData extends RowData>({
  table,
  onConfirm,
  ...props
}: Omit<AlertDeleteProps, 'description' | 'onConfirm'> & {
  table: Table<TData>
  title: string
  onConfirm: (payload: { rows: TData[] }) => void
}) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  const [{ loading }, handleConfirm] = useAsyncFn(async () => {
    await onConfirm({ rows: selectedRows })
  }, [onConfirm, selectedRows])

  if (selectedRows.length == 0) return <i />

  return (
    <AlertDelete description={`将永久删除 ${selectedRows.length} 项。`} disabled={loading} onConfirm={handleConfirm} {...props}>
      <Button loading={loading} size="sm" variant="destructive">
        已选择 {selectedRows.length} 项
      </Button>
    </AlertDelete>
  )
}
