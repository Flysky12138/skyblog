'use client'

import { Treaty } from '@elysiajs/eden'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { PaginationState } from '@tanstack/react-table'
import { EyeIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { DataTableRowActionButton } from '@/components/data-table/components/action'
import { createAppColumnHelper, useAppTable, useCellContext } from '@/components/data-table/hooks'
import { JsonViewer } from '@/components/json-viewer'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

type RowData = Treaty.Data<typeof rpc.dashboard.users.visits.get>['visits'][number]

const columnHelper = createAppColumnHelper<RowData>()

export function VisitTable() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15
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
      refreshInterval: 10_000
    }
  )

  const columns = React.useMemo(() => {
    return columnHelper.columns([
      columnHelper.display({
        id: 'selection',
        size: 40,
        cell: ({ cell }) => <cell.Selection />,
        header: ({ header }) => <header.Selection />
      }),
      columnHelper.display({
        header: '#',
        id: 'idnex',
        size: 42,
        cell: ({ row }) => row.getDisplayIndex() + 1
      }),
      columnHelper.accessor('ip', {
        header: 'Ip',
        size: 140,
        meta: {
          autoWidth: true
        }
      }),
      columnHelper.accessor('countryCode', {
        header: '国家',
        size: 120,
        meta: {
          align: 'center'
        }
      }),
      columnHelper.accessor('browser', {
        header: '浏览器',
        size: 130
      }),
      columnHelper.accessor('os', {
        header: '操作系统',
        size: 130
      }),
      columnHelper.accessor(row => row.agent.device.vendor, {
        header: '设备',
        id: 'device',
        size: 120
      }),
      columnHelper.accessor('activityType', {
        header: '类型',
        size: 120
      }),
      columnHelper.accessor('createdAt', {
        header: '创建时间',
        size: 180,
        sortFn: 'datetime',
        meta: {
          enableSorting: true
        },
        cell: ({ cell }) => <cell.Date />
      }),
      columnHelper.display({
        header: '操作',
        id: 'actions',
        size: 80,
        meta: {
          align: 'end'
        },
        cell: () => (
          <div className="flex justify-end gap-2">
            <VisitActionsCell />
          </div>
        )
      })
    ])
  }, [])

  const table = useAppTable({
    columns,
    data: data?.visits ?? [],
    manualPagination: true,
    pageCount: data?.pagination.pageCount ?? 0,
    state: {
      pagination
    },
    onPaginationChange: setPagination
  })

  return (
    <table.AppTable data-refresh-key={data?.visits.map(item => item.id).join(',')}>
      <div className="space-y-4">
        <table.Table isLoading={isLoading} />
        <div className="flex items-center justify-between">
          <table.RowsDeleteButton<RowData>
            title="访客信息"
            onConfirm={async ({ rows }) => {
              const ids = rows.map(item => item.id)
              await toastPromise(rpc.dashboard.users.visits.delete({ ids }).then(unwrap), {
                success: '删除成功'
              })
              await mutate()
            }}
          />
          <table.Pagination isLoading={isLoading} />
        </div>
      </div>
    </table.AppTable>
  )
}

function VisitActionsCell() {
  const { row } = useCellContext()

  const [json, setJson] = React.useState({})

  return (
    <Dialog
      onOpenChange={newOpen => {
        if (newOpen) {
          setJson(row.original as {})
        }
      }}
    >
      <DialogTrigger render={<DataTableRowActionButton />}>
        <EyeIcon />
      </DialogTrigger>
      <DialogContent className="max-w-3xl" fullScreen="sm">
        <DialogHeader>
          <DialogTitle>访客</DialogTitle>
          <DialogDescription>访客的详细信息</DialogDescription>
        </DialogHeader>
        <JsonViewer json={json} />
      </DialogContent>
    </Dialog>
  )
}
