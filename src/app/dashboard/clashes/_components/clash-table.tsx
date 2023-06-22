'use client'

import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { produce } from 'immer'
import { Pencil, Plus, Share2 } from 'lucide-react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'

import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { getColumnConfig } from '@/components/data-table/utils'
import { Switch } from '@/components/ui/switch'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatISOTime } from '@/lib/parser/time'
import { toastPromise } from '@/lib/toast'

import { ClashEditModal } from './clash-edit-modal'

export function ClashTable() {
  const [{}, copy] = useCopyToClipboard()

  const {
    data: clashes,
    isLoading,
    mutate
  } = useSWR('0198eb98-3acc-70ab-82f3-14d5ca929785', () => rpc.dashboard.clashes.get().then(unwrap), {
    fallbackData: [],
    refreshInterval: 10 * 1000
  })

  const columns: ColumnDef<(typeof clashes)[number]>[] = [
    getColumnConfig('selection'),
    getColumnConfig('index'),
    { accessorKey: 'name', header: '名称', size: 180 },
    {
      accessorKey: 'description',
      header: '描述',
      size: 200,
      meta: {
        widthFit: true
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
      cell: ({ row }) => (row.original.activityLogs.length ? formatISOTime(row.original.activityLogs[0].createdAt) : null)
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
            onCheckedChange={async () => {
              const clash = await toastPromise(
                rpc.dashboard.clashes({ id: row.original.id }).put({ isEnabled: !row.original.isEnabled }).then(unwrap),
                {
                  success: '更新成功'
                }
              )
              mutate(
                produce<typeof clashes>(draft => {
                  draft.splice(row.index, 1, clash)
                }),
                {
                  revalidate: false
                }
              )
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
              toast.success('复制成功')
            }}
          >
            <Share2 />
          </DataTableRowActionButton>
          <ClashEditModal
            value={row.original}
            onSubmit={async body => {
              const data = await toastPromise(rpc.dashboard.clashes({ id: row.original.id }).put(body).then(unwrap), {
                success: '修改成功'
              })
              mutate(
                produce<typeof clashes>(draft => {
                  draft.splice(row.index, 1, data)
                }),
                {
                  revalidate: false
                }
              )
            }}
          >
            <DataTableRowActionButton>
              <Pencil />
            </DataTableRowActionButton>
          </ClashEditModal>
          <DataTableRowDeleteButton
            description="将永久删除该项。"
            title={row.original.name}
            onConfirm={async () => {
              await toastPromise(rpc.dashboard.clashes({ id: row.original.id }).delete(), {
                success: '删除成功'
              })
              mutate(
                produce<typeof clashes>(draft => {
                  draft.splice(row.index, 1)
                }),
                {
                  revalidate: false
                }
              )
            }}
          />
        </div>
      ),
      header: () => (
        <ClashEditModal
          onSubmit={async body => {
            const data = await toastPromise(rpc.dashboard.clashes.post(body).then(unwrap), {
              success: '添加成功'
            })
            mutate(
              produce<typeof clashes>(draft => {
                draft.unshift(data)
              }),
              {
                revalidate: false
              }
            )
          }}
        >
          <DataTableRowActionButton>
            <Plus />
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
