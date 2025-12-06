'use client'

import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { produce } from 'immer'
import { Pencil, Plus } from 'lucide-react'
import useSWR from 'swr'

import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { getColumnConfig } from '@/components/data-table/utils'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { ClashTemplateEditModal } from './clash-template-edit-modal'
import { SWR_KEY_CLASH_TEMPLATES } from './utils'

export function ClashTemplateTable() {
  const {
    data: clashTemplates,
    isLoading,
    mutate
  } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => rpc.dashboard.clashes.templates.get().then(unwrap), {
    fallbackData: []
  })

  const columns: ColumnDef<(typeof clashTemplates)[number]>[] = [
    getColumnConfig('selection'),
    getColumnConfig('index'),
    {
      accessorKey: 'name',
      header: '名称',
      size: 180,
      meta: {
        widthFit: true
      }
    },
    {
      accessorKey: '_count',
      header: '被使用',
      size: 100,
      meta: {
        align: 'center'
      },
      cell: ({ row }) => row.original._count.clashes
    },
    getColumnConfig('createdAt'),
    getColumnConfig('updatedAt'),
    {
      id: 'actions',
      size: 100,
      meta: {
        align: 'end'
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <ClashTemplateEditModal
            value={row.original}
            onSubmit={async body => {
              const data = await toastPromise(rpc.dashboard.clashes.templates({ id: row.original.id }).put(body).then(unwrap), {
                success: '修改成功'
              })
              mutate(
                produce<typeof clashTemplates>(draft => {
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
          </ClashTemplateEditModal>
          <DataTableRowDeleteButton
            description="将永久删除该项。"
            title={row.original.name}
            onConfirm={async () => {
              await toastPromise(rpc.dashboard.clashes.templates({ id: row.original.id }).delete(), {
                success: '删除成功'
              })
              mutate(
                produce<typeof clashTemplates>(draft => {
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
        <ClashTemplateEditModal
          onSubmit={async body => {
            const data = await toastPromise(rpc.dashboard.clashes.templates.post(body).then(unwrap), {
              success: '添加成功'
            })
            mutate(
              produce<typeof clashTemplates>(draft => {
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
        </ClashTemplateEditModal>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data: clashTemplates,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}
