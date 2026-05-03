'use client'

import { RowData, Table } from '@tanstack/react-table'
import { TrashIcon } from 'lucide-react'
import React from 'react'
import { useAsyncFn } from 'react-use'

import { Button } from '@/components/ui-overwrite/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

/**
 * 列表行操作按钮
 */
export function DataTableRowActionButton({
  className,
  tooltip,
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof Button> & {
  tooltip?: React.ComponentProps<typeof TooltipContent> | string
}) {
  const button = (
    <Button
      className={cn(
        'size-7',
        'border-current/10! hover:border-current/30!',
        {
          'border-current/30! hover:border-current/50!': variant == 'destructive'
        },
        className
      )}
      size="icon"
      variant={variant}
      {...props}
    />
  )

  if (!tooltip) return button

  if (typeof tooltip == 'string') {
    tooltip = {
      children: tooltip
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent {...tooltip} />
    </Tooltip>
  )
}

/**
 * 列表行删除按钮
 */
export function DataTableRowDeleteButton({
  description = '此操作无法撤消，将永久删除该项',
  disabled,
  title,
  onConfirm
}: {
  description?: string
  disabled?: boolean
  title: string
  onConfirm: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>
}) {
  const [{ loading }, handleConfirm] = useAsyncFn(onConfirm, [onConfirm])

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<DataTableRowActionButton disabled={disabled} variant="destructive" />}>
        <TrashIcon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-w-18">取消</AlertDialogCancel>
          <AlertDialogAction className="min-w-32" disabled={loading} onClick={handleConfirm}>
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * 列表行批量删除按钮
 */
export function DataTableRowsDeleteButton<TData extends RowData>({
  table,
  title,
  onConfirm
}: {
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
    <AlertDialog>
      <AlertDialogTrigger render={<Button size="sm" variant="destructive" />}>已选择 {selectedRows.length} 项</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{`此操作无法撤消，将永久删除 ${selectedRows.length} 项`}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-w-18">取消</AlertDialogCancel>
          <AlertDialogAction className="min-w-32" disabled={loading} onClick={handleConfirm}>
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
