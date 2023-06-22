'use client'

import { ClassValue } from 'clsx'
import { isFunction } from 'es-toolkit'
import { isObjectLike } from 'es-toolkit/compat'
import { Trash } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn, tw } from '@/lib/utils'

import { AlertDelete, AlertDeleteProps } from './alert-delete'
import { DisplayByConditional } from './display/display-by-conditional'
import { Spinner } from './ui/spinner'

type AlignType = 'center' | 'left' | 'right'

type ColumnItemType<T> = {
  [K in keyof T]: {
    className?: ((text: T[K], record: T, index: number) => ClassValue) | ClassValue
    dataIndex: K
    key?: never
    render?: (text: T[K], record: T, index: number) => React.ReactNode
  }
}[keyof T]

interface ColumnSlotType<T> {
  className?: ((record: T, index: number) => ClassValue) | ClassValue
  dataIndex?: never
  key: 'index' | 'section' | (string & {})
  render?: (record: T, index: number) => React.ReactNode
}

type ColumnType<T> = {
  /**
   * 设置列的对齐方式
   * @default 'left'
   */
  align?: AlignType
  /**
   * 头部行的类名
   */
  headerClassName?: string
  /**
   * 头部行的标题
   */
  title?: (() => React.ReactNode) | string
} & (ColumnItemType<T> | ColumnSlotType<T>)

interface TableProps<T> {
  className?: string
  /**
   * 表格列的配置描述
   */
  columns: ColumnType<T>[]
  /**
   * 数据数组
   */
  dataSource?: T[]
  /**
   * 页面是否加载中
   */
  loading?: boolean
  /**
   * 表格行的类名
   */
  rowClassName?: ((record: T, index: number) => ClassValue) | ClassValue
  /**
   * 表格行 key 的取值
   * @default 'id'
   */
  rowKey?: ((record: T, index: number) => string) | keyof T
  /**
   * 表格行选择器
   */
  rowSelection?: {
    selectedRows: T[]
    onChange: (selectedRow: T[]) => void
  }
  /**
   * 设置行属性
   */
  onRow?: (record: T, index: number) => React.ComponentProps<'tr'>
}

export const Table = <T,>({
  className,
  columns,
  dataSource = [],
  loading = false,
  rowClassName,
  // @ts-ignore
  rowKey = 'id',
  rowSelection,
  onRow
}: TableProps<T>) => {
  const isValidating = loading && !!dataSource.length

  columns = modifyColumns(columns, { dataSource, isValidating, loading, rowSelection })

  return (
    <TablePrimitive className={className}>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHead key={(column.dataIndex || column.key) as string} className={cn(column.headerClassName, cellAlign(column.align))}>
              {isFunction(column.title) ? column.title() : column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <DisplayByConditional
          condition={!loading && !!dataSource.length}
          fallback={<TableRowLoading colSpan={columns.length}>{loading ? 'Loading...' : '内容为空'}</TableRowLoading>}
        >
          {isValidating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
              <Spinner className="size-10" />
            </div>
          )}
          {dataSource.map((record, index) => (
            <TableRow
              key={isFunction(rowKey) ? rowKey(record, index) : cellContentRender(record[rowKey])}
              className={isFunction(rowClassName) ? rowClassName(record, index) : rowClassName}
              {...onRow?.(record, index)}
            >
              {columns.map(column => (
                <TableCell
                  key={(column.dataIndex || column.key) as string}
                  className={cn(
                    isFunction(column.className)
                      ? Reflect.apply(column.className, null, column.dataIndex ? [record[column.dataIndex], record, index] : [record, index])
                      : column.className,
                    cellAlign(column.align)
                  )}
                >
                  {isFunction(column.render)
                    ? Reflect.apply(column.render, null, column.dataIndex ? [record[column.dataIndex], record, index] : [record, index])
                    : cellContentRender(column.dataIndex && record[column.dataIndex])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </DisplayByConditional>
      </TableBody>
    </TablePrimitive>
  )
}

export const TablePrimitive = ({ className, ...props }: React.ComponentProps<'table'>) => (
  <div className="bg-card relative w-full overflow-auto rounded-sm shadow-sm dark:shadow-black" data-slot="table">
    <table className={cn('w-full table-auto caption-bottom text-sm', className)} {...props} />
  </div>
)

export const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => (
  <thead className={cn('[&_tr]:border-b-2', className)} {...props} />
)

export const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
  <tbody className={cn('relative [&_tr:last-child]:border-0', className)} {...props} />
)

export const TableFooter = ({ className, ...props }: React.ComponentProps<'tfoot'>) => (
  <tfoot className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)} {...props} />
)

export const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
  <tr className={cn('not-[&:has(th)]:hover:bg-muted/50 h-10 border-b', className)} {...props} />
)

export const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
  <th className={cn('text-muted-foreground h-10 px-4 text-left align-middle font-medium whitespace-nowrap', className)} {...props} />
)

export const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
  <td className={cn('px-4 py-1.5 align-middle whitespace-nowrap', className)} {...props} />
)

export const TableCaption = ({ className, ...props }: React.ComponentProps<'caption'>) => (
  <caption className={cn('text-muted-foreground text-sm', className)} {...props} />
)

export const TableRowLoading = ({ children, className, ...props }: RequiredPick<React.ComponentProps<'td'>, 'colSpan'>) => (
  <TableRow>
    <TableCell className={cn('font-title cursor-default text-center', className)} {...props}>
      {children || 'Loading...'}
    </TableCell>
  </TableRow>
)

export const TableActionButton = ({
  className,
  tooltip,
  ...props
}: React.ComponentProps<typeof Button> & {
  tooltip?: React.ComponentProps<typeof TooltipContent> | string
}) => {
  const button = (
    <Button className={cn('size-7 rounded-sm border not-hover:border-transparent', className)} size="icon" variant="secondary" {...props} />
  )

  if (!tooltip) {
    return button
  }

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

export const TableDeleteButton = ({ disabled, ...props }: AlertDeleteProps & { disabled?: boolean }) => (
  <AlertDelete {...props}>
    <TableActionButton className="border-0!" disabled={disabled} variant="destructive">
      <Trash />
    </TableActionButton>
  </AlertDelete>
)

/**
 * 单元格内容
 */
const cellContentRender = (text: any): string => {
  if (!text) return ''
  if (isObjectLike(text)) return JSON.stringify(text, null, 4)
  return text
}

/**
 * 列的对齐方式
 */
const cellAlign = (align: AlignType = 'left') => {
  switch (align) {
    case 'center':
      return tw`text-center`
    case 'left':
      return tw`text-left`
    case 'right':
      return tw`text-right`
  }
}

/**
 * 修改 `columns`
 */
const modifyColumns = <T,>(
  columns: ColumnType<T>[],
  options: Pick<TableProps<T>, 'dataSource' | 'loading' | 'rowSelection'> & {
    isValidating: boolean
  }
): ColumnType<T>[] => {
  const { dataSource = [], isValidating, loading, rowSelection } = options

  const selectedRows = new Set<T>(rowSelection?.selectedRows)
  const isSelectedAll = dataSource.every(record => selectedRows.has(record))

  return columns.map(column => {
    switch (column.key) {
      case 'index':
        return Object.assign({ headerClassName: tw`w-9`, title: '#', render: (_, index: number) => index + 1 } as ColumnType<T>, column)
      case 'section':
        return Object.assign(
          {
            className: tw`leading-0`,
            headerClassName: tw`w-9 leading-0`,
            key: 'section',
            render: record => (
              <Checkbox
                checked={selectedRows.has(record)}
                disabled={loading || isValidating}
                onCheckedChange={() => {
                  selectedRows.has(record) ? selectedRows.delete(record) : selectedRows.add(record)
                  rowSelection?.onChange?.(Array.from(selectedRows))
                }}
              />
            ),
            title: () => (
              <Checkbox
                checked={!loading && isSelectedAll}
                disabled={loading || isValidating}
                onCheckedChange={() => {
                  isSelectedAll ? selectedRows.clear() : dataSource.forEach(it => selectedRows.add(it))
                  rowSelection?.onChange?.(Array.from(selectedRows))
                }}
              />
            )
          } as ColumnType<T>,
          column
        )
      default:
        return column
    }
  })
}
