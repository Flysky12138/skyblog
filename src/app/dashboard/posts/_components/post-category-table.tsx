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

import { POST_CATEGORY_SWR_KEY } from '../utils'
import { PostCategoryEditModal } from './post-category-edit-modal'

export function PostCategoryTable() {
  const {
    data: categories,
    isLoading,
    mutate
  } = useSWR(POST_CATEGORY_SWR_KEY, () => rpc.dashboard.posts.categories.get().then(unwrap), {
    fallbackData: []
  })

  const columns: ColumnDef<(typeof categories)[number]>[] = [
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
          <PostCategoryEditModal
            value={row.original}
            onSubmit={async body => {
              const data = await toastPromise(rpc.dashboard.posts.categories({ id: row.original.id }).put(body).then(unwrap), {
                success: '编辑成功'
              })
              await mutate(
                produce<typeof categories>(draft => {
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
          </PostCategoryEditModal>
          <DataTableRowDeleteButton
            description="这将永久删除分类。"
            title={row.original.name}
            onConfirm={async () => {
              await toastPromise(rpc.dashboard.posts.categories({ id: row.original.id }).delete(), {
                success: '删除成功'
              })
              mutate(
                produce<typeof categories>(draft => {
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
    data: categories,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}
