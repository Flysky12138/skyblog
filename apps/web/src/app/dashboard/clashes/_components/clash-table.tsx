'use client'

import { produce, useCopy } from '@repo/react-hooks'
import { toast } from '@repo/ui/base'
import { Switch } from '@repo/ui/components/switch'
import { ColumnDef, getCoreRowModel, getSortedRowModel, Row, useReactTable } from '@tanstack/react-table'
import { CopyIcon, PencilIcon, PlusIcon } from 'lucide-react'
import useSWR from 'swr'

import { ClashCreateBodyType, ClashUpdateBodyType } from '@/app/api/[[...elysia]]/dashboard/clashes/model'
import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { getColumnConfig } from '@/components/data-table/utils'
import { TimeHelper } from '@/lib/helper/time'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { ClashEditModal } from './clash-edit-modal'

export function ClashTable() {
  const { copy } = useCopy({
    onCopy: () => {
      toast.success('复制成功')
    }
  })

  const {
    data: clashes,
    isLoading,
    mutate
  } = useSWR('0198eb98-3acc-70ab-82f3-14d5ca929785', () => rpc.dashboard.clashes.get().then(unwrap), {
    fallbackData: [],
    refreshInterval: 10 * 1000
  })

  type RowData = Row<(typeof clashes)[number]>

  // 创建
  const handleCreate = async (body: ClashCreateBodyType) => {
    try {
      const data = await toastPromise(rpc.dashboard.clashes.post(body).then(unwrap), {
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
  }

  // 删除
  const handleDelete = async (row: RowData) => {
    try {
      await toastPromise(rpc.dashboard.clashes({ id: row.original.id }).delete().then(unwrap), {
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
  }

  // 更新
  const handleUpdate = async (row: RowData, body: ClashUpdateBodyType) => {
    try {
      const data = await toastPromise(rpc.dashboard.clashes({ id: row.original.id }).put(body).then(unwrap), {
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
  }

  // 修改状态
  const handleChangeStatus = async (row: RowData) => {
    try {
      const clash = await toastPromise(rpc.dashboard.clashes({ id: row.original.id }).put({ isEnabled: !row.original.isEnabled }).then(unwrap), {
        success: '修改成功'
      })
      await mutate(current => {
        return produce(current, draft => {
          draft?.splice(row.index, 1, clash)
        })
      }, false)
    } catch (error) {
      console.error(error)
    }
  }

  const columns: ColumnDef<(typeof clashes)[number]>[] = [
    getColumnConfig('index'),
    { accessorKey: 'name', header: '名称', size: 180 },
    {
      accessorKey: 'description',
      header: '描述',
      size: 200,
      meta: {
        autoWidth: true
      }
    },
    {
      accessorKey: 'count',
      header: '次数',
      size: 80,
      meta: {
        align: 'center'
      },
      cell: ({ row }) => row.original.activityLogs.length
    },
    {
      header: '最近订阅时间',
      id: 'lastAt',
      size: 180,
      cell: ({ row }) => (row.original.activityLogs.length ? TimeHelper.formatDate(row.original.activityLogs[0].createdAt) : null)
    },
    getColumnConfig('updatedAt'),
    {
      accessorKey: 'isEnabled',
      header: '启用',
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
          <DataTableRowActionButton
            tooltip="复制"
            onClick={() => {
              copy(new URL(`/api/clashes/${row.original.id}`, window.origin).href)
            }}
          >
            <CopyIcon />
          </DataTableRowActionButton>
          <ClashEditModal
            value={row.original}
            onSubmit={async body => {
              await handleUpdate(row, body)
            }}
          >
            <DataTableRowActionButton>
              <PencilIcon />
            </DataTableRowActionButton>
          </ClashEditModal>
          <DataTableRowDeleteButton
            title={row.original.name}
            onConfirm={async () => {
              await handleDelete(row)
            }}
          />
        </div>
      ),
      header: () => (
        <ClashEditModal onSubmit={handleCreate}>
          <DataTableRowActionButton>
            <PlusIcon />
          </DataTableRowActionButton>
        </ClashEditModal>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data: clashes,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}
