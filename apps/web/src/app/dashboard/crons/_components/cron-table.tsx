'use client'

import { Treaty } from '@elysiajs/eden'
import { produce, useAsyncFn } from '@repo/react-hooks'
import { Switch } from '@repo/ui/components/switch'
import { ColumnDef, getCoreRowModel, getSortedRowModel, Row, useReactTable } from '@tanstack/react-table'
import { PencilIcon, PlayIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { CronCreateBodyType, CronUpdateBodyType } from '@/app/api/[[...elysia]]/dashboard/crons/model'
import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { getColumnConfig } from '@/components/data-table/utils'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { CronEditModal } from './cron-edit-modal'

export function CronTable() {
  const {
    data: crons,
    isLoading,
    mutate
  } = useSWR('019dd3e1-517a-74ed-8435-8f4ff96ddd0c', () => rpc.dashboard.crons.get().then(unwrap), {
    fallbackData: []
  })

  type RowData = Row<(typeof crons)[number]>

  // 创建
  const handleCreate = React.useEffectEvent(async (body: CronCreateBodyType) => {
    try {
      const data = await toastPromise(rpc.dashboard.crons.post(body).then(unwrap), {
        success: '创建成功'
      })
      await mutate(current => {
        return produce(current, draft => {
          draft?.unshift(data)
        })
      }, false)
    } catch (error) {
      console.error(error)
    }
  })

  // 删除
  const handleDelete = React.useEffectEvent(async (row: RowData) => {
    try {
      await toastPromise(rpc.dashboard.crons({ id: row.original.id }).delete().then(unwrap), {
        success: '删除成功'
      })
      await mutate(current => {
        return produce(current, draft => {
          draft?.splice(row.index, 1)
        })
      }, false)
    } catch (error) {
      console.error(error)
    }
  })

  // 更新
  const handleUpdate = React.useEffectEvent(async (row: RowData, body: CronUpdateBodyType) => {
    try {
      const data = await toastPromise(rpc.dashboard.crons({ id: row.original.id }).put(body).then(unwrap), {
        success: '更新成功'
      })
      await mutate(current => {
        return produce(current, draft => {
          draft?.splice(row.index, 1, data)
        })
      }, false)
    } catch (error) {
      console.error(error)
    }
  })

  // 修改状态
  const handleChangeStatus = React.useEffectEvent(async (row: RowData) => {
    try {
      const data = await toastPromise(rpc.dashboard.crons({ id: row.id }).put({ isEnabled: !row.original.isEnabled }).then(unwrap), {
        success: '修改成功'
      })
      await mutate(current => {
        return produce(current, draft => {
          draft?.splice(row.index, 1, data)
        })
      }, false)
    } catch (error) {
      console.error(error)
    }
  })

  const columns: ColumnDef<(typeof crons)[number]>[] = [
    getColumnConfig('index'),
    {
      accessorKey: 'name',
      header: '名称',
      size: 250,
      meta: {
        widthFit: true
      }
    },
    getColumnConfig('updatedAt'),
    getColumnConfig('createdAt'),
    {
      accessorKey: 'isEnabled',
      header: '开关',
      size: 60,
      cell: ({ row }) => (
        <div className="leading-0">
          <Switch
            checked={row.original.isEnabled}
            onCheckedChange={() => {
              void handleChangeStatus(row)
            }}
          />
        </div>
      )
    },
    {
      id: 'actions',
      size: 140,
      meta: {
        align: 'end'
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <DataTableRowRunButton row={row.original} />
          <CronEditModal
            value={row.original}
            onSubmit={async body => {
              await handleUpdate(row, body)
            }}
          >
            <DataTableRowActionButton>
              <PencilIcon />
            </DataTableRowActionButton>
          </CronEditModal>
          <DataTableRowDeleteButton
            title={row.original.name}
            onConfirm={async () => {
              await handleDelete(row)
            }}
          />
        </div>
      ),
      header: () => (
        <CronEditModal onSubmit={handleCreate}>
          <DataTableRowActionButton>
            <PlusIcon />
          </DataTableRowActionButton>
        </CronEditModal>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data: crons,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}

// 运行按键
function DataTableRowRunButton({ row }: { row: Treaty.Data<ReturnType<typeof rpc.dashboard.crons>['get']> }) {
  const [{ loading }, handleRun] = useAsyncFn(async () => {
    try {
      await toastPromise(rpc.dashboard.crons({ id: row.id }).run.post().then(unwrap), {
        success: '执行成功'
      })
    } catch (error) {
      console.error(error)
    }
  }, [row.id])

  return (
    <DataTableRowActionButton
      disabled={!row.isEnabled}
      loading={loading}
      onClick={() => {
        void handleRun()
      }}
    >
      <PlayIcon />
    </DataTableRowActionButton>
  )
}
