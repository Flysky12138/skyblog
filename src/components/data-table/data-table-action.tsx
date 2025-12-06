'use client'

import { RowData, Table } from '@tanstack/react-table'
import { Trash } from 'lucide-react'
import React from 'react'

import { AlertDelete, AlertDeleteProps } from '@/components/alert-delete'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
  const [isPending, startTransition] = React.useTransition()

  return (
    <AlertDelete
      disabled={isPending}
      onConfirm={event => {
        startTransition(async () => {
          await onConfirm(event)
        })
      }}
      {...props}
    >
      <DataTableRowActionButton className="border-0!" disabled={disabled || isPending} variant="destructive">
        {isPending ? <Spinner /> : <Trash />}
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
  const [isPending, startTransition] = React.useTransition()

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  if (selectedRows.length == 0) return <i />

  return (
    <AlertDelete
      description={`将永久删除 ${selectedRows.length} 项。`}
      disabled={isPending}
      onConfirm={() => {
        startTransition(async () => {
          await onConfirm({ rows: selectedRows })
        })
      }}
      {...props}
    >
      <Button disabled={isPending} size="sm" variant="destructive">
        {isPending ? <Spinner /> : `已选择 ${selectedRows.length} 项`}
      </Button>
    </AlertDelete>
  )
}
