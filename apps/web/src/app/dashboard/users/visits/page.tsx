'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Skeleton } from '@repo/ui/components/skeleton'
import { ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { EyeIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'
import useSWR from 'swr'

import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowsDeleteButton } from '@/components/data-table/data-table-action'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { getColumnConfig } from '@/components/data-table/utils'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

const MDXClient = dynamic(() => import('@repo/mdx').then(it => it.MDXClient), {
  ssr: false,
  loading: () => <Skeleton className="h-48" />
})

export default function Page() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, isLoading, mutate } = useSWR(
    ['0198eb9a-1aa7-77d8-9b1d-0f0f7efb4130', pagination],
    () => {
      return rpc.dashboard.users.visits
        .get({
          query: {
            limit: pagination.pageSize,
            page: pagination.pageIndex + 1
          }
        })
        .then(unwrap)
    },
    {
      keepPreviousData: true,
      refreshInterval: 10 * 1000
    }
  )

  const columns: ColumnDef<NonNullable<typeof data>['visits'][number]>[] = [
    getColumnConfig('selection'),
    getColumnConfig('index'),
    {
      accessorKey: 'ip',
      header: 'Ip',
      size: 140,
      meta: {
        widthFit: true
      }
    },
    {
      accessorKey: 'countryCode',
      header: '国家',
      size: 120,
      meta: {
        align: 'center'
      }
    },
    { accessorKey: 'browser', header: '浏览器', size: 130 },
    { accessorKey: 'os', header: '操作系统', size: 130 },
    {
      header: '设备',
      id: 'device',
      size: 120,
      cell: ({ row }) => row.original.agent.device.vendor
    },
    { accessorKey: 'activityType', header: '类型', size: 120 },
    getColumnConfig('createdAt'),
    {
      header: '操作',
      id: 'actions',
      size: 80,
      meta: {
        align: 'end'
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger render={<DataTableRowActionButton />}>
              <EyeIcon />
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>访客</DialogTitle>
                <DialogDescription>访客的详细信息</DialogDescription>
              </DialogHeader>
              <MDXClient
                className="**:data-line:whitespace-pre-wrap [&_code+*]:hidden **:[code]:max-h-none **:[code]:text-sm"
                loadingRender={<Skeleton className="h-48" />}
                source={['```json', JSON.stringify(row.original, null, 2), '```'].join('\n')}
              />
            </DialogContent>
          </Dialog>
        </div>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data: data?.visits ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: data?.pagination.pageCount ?? 0,
    meta: {
      isLoading
    },
    state: {
      pagination
    },
    getRowId: row => String(row.id),
    onPaginationChange: setPagination
  })

  return (
    <div className="space-y-4">
      <DataTable table={table} />
      <div className="flex items-center justify-between">
        <DataTableRowsDeleteButton
          table={table}
          title="访客信息"
          onConfirm={async ({ rows }) => {
            await toastPromise(rpc.dashboard.users.visits.delete({ ids: rows.map(item => Number(item.id)) }).then(unwrap), {
              success: '删除成功'
            })
            await mutate()
          }}
        />
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
