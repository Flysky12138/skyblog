'use client'

import { produce } from '@repo/react-hooks'
import { ColumnDef, getCoreRowModel, getSortedRowModel, Row, useReactTable } from '@tanstack/react-table'
import { PencilIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { CategoryUpdateBodyType } from '@/app/api/[[...elysia]]/dashboard/posts/categories/model'
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

  type RowData = Row<(typeof categories)[number]>

  // 更新
  const handleUpdate = React.useEffectEvent(async (row: RowData, body: CategoryUpdateBodyType) => {
    try {
      const data = await toastPromise(rpc.dashboard.posts.categories({ id: row.original.id }).put(body).then(unwrap), {
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

  // 删除
  const handleDelete = React.useEffectEvent(async (row: RowData) => {
    try {
      await toastPromise(rpc.dashboard.posts.categories({ id: row.original.id }).delete().then(unwrap), {
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

  const columns: ColumnDef<(typeof categories)[number]>[] = [
    getColumnConfig('index'),
    {
      accessorKey: 'name',
      header: '标题',
      size: 120,
      meta: {
        autoWidth: true
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
              await handleUpdate(row, body)
            }}
          >
            <DataTableRowActionButton>
              <PencilIcon />
            </DataTableRowActionButton>
          </PostCategoryEditModal>
          <DataTableRowDeleteButton
            title={row.original.name}
            onConfirm={async () => {
              await handleDelete(row)
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
