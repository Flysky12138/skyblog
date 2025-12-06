'use client'

import { ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { produce } from 'immer'
import { Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'

import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { DataTableColumnSortHeader } from '@/components/data-table/data-table-column-header'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { getColumnConfig } from '@/components/data-table/utils'
import { Switch } from '@/components/ui/switch'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

export function PostTable() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, isLoading, mutate } = useSWR(
    ['0198eb98-ec15-7335-a9d9-c34f3c3aa634', pagination],
    () => {
      return rpc.dashboard.posts
        .get({
          query: {
            limit: pagination.pageSize,
            page: pagination.pageIndex + 1
          }
        })
        .then(unwrap)
    },
    {
      keepPreviousData: true
    }
  )

  const columns: ColumnDef<NonNullable<typeof data>['posts'][number]>[] = [
    getColumnConfig('selection'),
    getColumnConfig('index'),
    {
      accessorKey: 'title',
      header: '标题',
      size: 250,
      cell: ({ row }) => <div className="line-clamp-1 whitespace-normal">{row.original.title}</div>
    },
    {
      accessorKey: 'summary',
      header: '描述',
      meta: {
        widthFit: true
      },
      cell: ({ row }) => <div className="line-clamp-2 whitespace-normal">{row.original.summary}</div>
    },
    {
      accessorKey: 'categories',
      header: '分类',
      size: 100,
      cell: ({ row }) => row.original.categories.map(({ category }) => category.name).join('、')
    },
    {
      accessorKey: 'tags',
      header: '标签',
      size: 100,
      cell: ({ row }) => row.original.tags.map(({ tag }) => tag.name).join('、')
    },
    {
      accessorKey: 'viewCount',
      size: 100,
      header: ({ column }) => <DataTableColumnSortHeader column={column} title="浏览量" />
    },
    {
      accessorKey: 'isPublished',
      header: '公开',
      size: 60,
      cell: ({ row }) => (
        <div className="leading-0">
          <Switch
            checked={row.original.isPublished}
            onCheckedChange={async () => {
              const post = await toastPromise(
                rpc.dashboard.posts({ id: row.original.id }).put({ isPublished: !row.original.isPublished }).then(unwrap),
                {
                  success: '更新成功'
                }
              )
              mutate(
                produce<typeof data>(draft => {
                  draft?.posts.splice(row.index, 1, post)
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
      header: '操作',
      id: 'actions',
      size: 140,
      meta: {
        align: 'end'
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <DataTableRowActionButton asChild>
            <Link className="cursor-pointer" href={`/posts/${row.original.slug ?? row.original.id}`} target="_blank">
              <Eye />
            </Link>
          </DataTableRowActionButton>
          <DataTableRowActionButton asChild>
            <Link className="cursor-pointer" href={`/dashboard/posts/${row.original.id}`}>
              <Pencil />
            </Link>
          </DataTableRowActionButton>
          <DataTableRowDeleteButton
            description="这将永久删除文章。"
            title={row.original.title}
            onConfirm={async () => {
              await toastPromise(rpc.dashboard.posts({ id: row.original.id }).delete().then(unwrap), {
                success: '删除成功'
              })
              mutate(
                produce<typeof data>(draft => {
                  draft?.posts.splice(row.index, 1)
                }),
                {
                  revalidate: data?.posts.length == 1
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
    data: data?.posts ?? [],
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
    getRowId: row => row.id,
    onPaginationChange: setPagination
  })

  return (
    <div className="space-y-4">
      <DataTable table={table} />
      <div className="flex items-center justify-end">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
