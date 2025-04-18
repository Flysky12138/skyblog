'use client'

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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { ClassValue } from 'clsx'
import { Trash } from 'lucide-react'
import React from 'react'
import { DisplayByConditional } from './display/display-by-conditional'

type AlignType = 'left' | 'center' | 'right'

type ColumnItemType<T> = {
  [K in keyof T]: {
    dataIndex: K
    key?: never
    render?: (text: T[K], record: T, index: number) => React.ReactNode
  }
}[keyof T]

type ColumnSlotType<T> = {
  dataIndex?: never
  key: 'index' | (string & {})
  render?: (record: T, index: number) => React.ReactNode
}

type ColumnType<T> = {
  /**
   * 设置列的对齐方式
   * @default 'left'
   */
  align?: AlignType
  className?: ClassValue
  /**
   * 头部行的类名
   */
  headerClassName?: string
  /**
   * 头部行的标题
   */
  title?: string | (() => React.ReactNode)
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
   * 设置行属性
   */
  onRow?: (record: T, index: number) => React.ComponentProps<'tr'>
  /**
   * 表格行的类名
   */
  rowClassName?: ClassValue | ((record: T, index: number) => ClassValue)
  /**
   * 表格行 key 的取值
   * @default 'id'
   */
  rowKey?: keyof T | ((record: T) => string)
  /**
   * 表格行是否可选择
   */
  rowSelection?: {}
}

export const Table = <T,>({
  className,
  columns,
  dataSource = [],
  // @ts-ignore
  rowKey = 'id',
  loading,
  rowClassName,
  onRow
}: TableProps<T>) => {
  columns = columns.map(column => {
    switch (column.key) {
      case 'index':
        // 序号列默认配置描述
        return Object.assign({ headerClassName: 'w-9', render: (_, index: number) => index + 1, title: '#' } as ColumnType<T>, column)
      default:
        return column
    }
  })

  return (
    <TablePrimitive className={className}>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHead key={(column.dataIndex || column.key) as string} className={cn(column.headerClassName, alignClassName(column.align))}>
              {typeof column.title == 'function' ? column.title() : column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <DisplayByConditional
          condition={!loading && !!dataSource.length}
          fallback={<TableRowLoading colSpan={columns.length}>{loading ? 'Loading...' : '内容为空'}</TableRowLoading>}
        >
          {dataSource.map((record, index) => (
            <TableRow
              key={typeof rowKey == 'function' ? rowKey(record) : renderCellData(record[rowKey])}
              className={typeof rowClassName == 'function' ? rowClassName(record, index) : rowClassName}
              {...onRow?.(record, index)}
            >
              {columns.map(column => (
                <TableCell key={(column.dataIndex || column.key) as string} className={cn(column.className, alignClassName(column.align))}>
                  {typeof column.render == 'function'
                    ? Reflect.apply(column.render, null, column.dataIndex ? [record[column.dataIndex], record, index] : [record, index])
                    : renderCellData(column.dataIndex && record[column.dataIndex])}
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
  <section className="relative w-full overflow-auto rounded-sm shadow-sm backdrop-brightness-130 dark:shadow-black">
    <table className={cn('w-full table-fixed caption-bottom text-sm', className)} {...props} />
  </section>
)

export const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => (
  <thead className={cn('[&_tr]:border-b-2', className)} {...props} />
)

export const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)

export const TableFooter = ({ className, ...props }: React.ComponentProps<'tfoot'>) => (
  <tfoot className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)} {...props} />
)

export const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
  <tr className={cn('not-[&:has(th)]:hover:bg-muted/50 h-10 border-b', className)} {...props} />
)

export const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
  <th className={cn('text-muted-foreground h-10 px-2 text-left align-middle font-medium', className)} {...props} />
)

export const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
  <td className={cn('px-2 py-1.5 align-middle', className)} {...props} />
)

export const TableCaption = ({ className, ...props }: React.ComponentProps<'caption'>) => (
  <caption className={cn('text-muted-foreground text-sm', className)} {...props} />
)

export const TableRowLoading = ({ className, children, ...props }: RequiredPick<React.ComponentProps<'td'>, 'colSpan'>) => (
  <TableRow>
    <TableCell className={cn('font-title cursor-default text-center', className)} {...props}>
      {children || 'Loading...'}
    </TableCell>
  </TableRow>
)

export const TableActionButton = ({ className, ...props }: React.ComponentProps<typeof Button>) => (
  <Button className={cn('size-7 rounded-sm border not-hover:border-transparent', className)} size="icon" variant="secondary" {...props} />
)

const TableDeleteButton: React.FC<{
  description: string
  disabled?: boolean
  onConfirm: () => void
  title: string
}> = ({ title, description, disabled, onConfirm }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <TableActionButton className="border-0!" disabled={disabled} variant="destructive">
        <Trash />
      </TableActionButton>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="break-all">{title}</AlertDialogTitle>
        <AlertDialogDescription>此操作无法撤消，{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>确定</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
export { TableDeleteButton }

/**
 * 表格的默认显示内容
 */
const renderCellData = (text: any): string => {
  if (!text) return ''
  if (typeof text == 'object') return JSON.stringify(text, null, 4)
  return text
}

const alignClassName = (align: AlignType = 'left') => {
  switch (align) {
    case 'left':
      return 'text-left'
    case 'right':
      return 'text-right'
    case 'center':
      return 'text-center'
  }
}
