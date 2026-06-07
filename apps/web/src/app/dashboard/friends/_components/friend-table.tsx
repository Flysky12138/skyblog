'use client'

import { Switch } from '@repo/ui/components/switch'
import { ColumnDef, getCoreRowModel, getSortedRowModel, Row, useReactTable } from '@tanstack/react-table'
import { produce } from 'immer'
import { EyeIcon, PencilIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'

import { FriendCreateBodyType, FriendUpdateBodyType } from '@/app/api/[[...elysia]]/dashboard/friends/model'
import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { getColumnConfig } from '@/components/data-table/utils'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { FriendEditModal } from './friend-edit-modal'

export function FriendTable() {
  const { data, isLoading, mutate } = useSWR('0198eb99-caec-75cc-a4de-05dfa95cc14a', () => rpc.dashboard.friends.get().then(unwrap), {
    fallbackData: []
  })

  type RowData = Row<(typeof data)[number]>

  // 创建
  const handleCreate = async (body: FriendCreateBodyType) => {
    try {
      const data = await toastPromise(rpc.dashboard.friends.post(body).then(unwrap), {
        success: '创建成功'
      })
      await mutate(current => {
        return produce(current, draft => {
          draft?.push(data)
        })
      }, false)
    } catch (error) {
      console.error(error)
    }
  }

  // 删除
  const handleDelete = async (row: RowData) => {
    try {
      await toastPromise(rpc.dashboard.friends({ id: row.original.id }).delete().then(unwrap), {
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
  const handleUpdate = async (row: RowData, body: FriendUpdateBodyType) => {
    try {
      const data = await toastPromise(rpc.dashboard.friends({ id: row.original.id }).put(body).then(unwrap), {
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
      const data = await toastPromise(rpc.dashboard.friends({ id: row.original.id }).put({ isEnabled: !row.original.isEnabled }).then(unwrap), {
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
  }

  const columns: ColumnDef<NonNullable<typeof data>[number]>[] = [
    getColumnConfig('index'),
    {
      accessorKey: 'name',
      header: '名称',
      size: 150,
      cell: ({ row }) => <div className="truncate">{row.original.name}</div>
    },
    {
      accessorKey: 'siteUrl',
      header: '链接',
      size: 400,
      cell: ({ row }) => <div className="truncate">{row.original.siteUrl}</div>
    },
    {
      accessorKey: 'description',
      header: '描述',
      meta: {
        autoWidth: true
      },
      cell: ({ row }) => <div className="line-clamp-2 whitespace-normal">{row.original.description}</div>
    },
    {
      accessorKey: 'isEnabled',
      header: '公开',
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
          <DataTableRowActionButton nativeButton={false} render={<Link className="cursor-pointer" href={row.original.siteUrl} target="_blank" />}>
            <EyeIcon />
          </DataTableRowActionButton>
          <FriendEditModal
            value={row.original}
            onSubmit={async body => {
              await handleUpdate(row, body)
            }}
          >
            <DataTableRowActionButton>
              <PencilIcon />
            </DataTableRowActionButton>
          </FriendEditModal>
          <DataTableRowDeleteButton
            title={row.original.name}
            onConfirm={async () => {
              await handleDelete(row)
            }}
          />
        </div>
      ),
      header: () => (
        <FriendEditModal onSubmit={handleCreate}>
          <DataTableRowActionButton>
            <PlusIcon />
          </DataTableRowActionButton>
        </FriendEditModal>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}
