'use client'

import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { produce } from 'immer'
import { Pencil } from 'lucide-react'
import useSWR from 'swr'

import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { getColumnConfig } from '@/components/data-table/utils'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { POST_TAG_SWR_KEY } from '../utils'
import { PostTagEditModal } from './post-tag-edit-modal'

export function PostTagTable() {
  const {
    data: tags,
    isLoading,
    mutate
  } = useSWR(POST_TAG_SWR_KEY, () => rpc.dashboard.posts.tags.get().then(unwrap), {
    fallbackData: []
  })

  const columns: ColumnDef<(typeof tags)[number]>[] = [
    getColumnConfig('selection'),
    getColumnConfig('index'),
    {
      accessorKey: 'name',
      header: '标题',
      size: 120,
      meta: {
        widthFit: true
      }
    },
    getColumnConfig('updatedAt'),
    getColumnConfig('createdAt'),
    {
      header: '操作',
      id: 'actions',
      size: 100,
      meta: {
        align: 'end'
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <PostTagEditModal
            value={row.original}
            onSubmit={async body => {
              const data = await toastPromise(rpc.dashboard.posts.tags({ id: row.original.id }).put(body).then(unwrap), {
                success: '编辑成功'
              })
              await mutate(
                produce<typeof tags>(draft => {
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
          </PostTagEditModal>
          <DataTableRowDeleteButton
            description="这将永久删除标签。"
            title={row.original.name}
            onConfirm={async () => {
              await toastPromise(rpc.dashboard.posts({ id: row.original.id }).delete(), {
                success: '删除成功'
              })
              mutate(
                produce<typeof tags>(draft => {
                  draft.splice(row.index, 1)
                }),
                {
                  revalidate: false
                }
              )
            }}
          />
        </div>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data: tags,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}
