'use client'

import { Treaty } from '@elysiajs/eden'
import { Switch } from '@repo/ui/components/switch'
import { PaginationState } from '@tanstack/react-table'
import { produce } from 'immer'
import { EyeIcon, PencilIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'

import { createAppColumnHelper, useAppTable } from '@/components/data-table/hooks'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

type RowData = Treaty.Data<typeof rpc.dashboard.posts.get>['posts'][number]

const columnHelper = createAppColumnHelper<RowData>()

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

  const columns = React.useMemo(() => {
    return columnHelper.columns([
      columnHelper.display({
        header: '#',
        id: 'idnex',
        size: 42,
        cell: ({ row }) => row.getDisplayIndex() + 1
      }),
      columnHelper.accessor('title', {
        header: '标题',
        size: 250,
        cell: ({ getValue }) => <div className="truncate">{getValue()}</div>
      }),
      columnHelper.accessor('summary', {
        header: '描述',
        minSize: 300,
        meta: {
          autoWidth: true
        },
        cell: ({ getValue }) => <div className="line-clamp-2 whitespace-normal">{getValue()}</div>
      }),
      columnHelper.accessor('categories', {
        header: '分类',
        size: 150,
        cell: ({ getValue }) => (
          <div className="truncate">
            {getValue()
              .map(({ category }) => category.name)
              .join('、')}
          </div>
        )
      }),
      columnHelper.accessor('tags', {
        header: '标签',
        minSize: 150,
        cell: ({ getValue }) => (
          <div className="truncate">
            {getValue()
              .map(({ tag }) => tag.name)
              .join('、')}
          </div>
        )
      }),
      columnHelper.accessor('viewCount', {
        header: '浏览量',
        size: 100,
        meta: {
          enableSorting: true
        }
      }),
      columnHelper.accessor('isPublished', {
        header: '公开',
        size: 60,
        cell: ({ row }) => (
          <div className="leading-0">
            <Switch
              checked={row.original.isPublished}
              onCheckedChange={() => {
                void (async () => {
                  try {
                    const post = await toastPromise(
                      rpc.dashboard.posts({ id: row.original.id }).put({ isPublished: !row.original.isPublished }).then(unwrap),
                      {
                        success: '更新成功'
                      }
                    )
                    await mutate(current => {
                      return produce(current, draft => {
                        draft?.posts.splice(row.index, 1, post)
                      })
                    }, false)
                  } catch (error) {
                    console.error(error)
                  }
                })()
              }}
            />
          </div>
        )
      }),
      columnHelper.display({
        header: '操作',
        id: 'actions',
        size: 140,
        meta: {
          align: 'end'
        },
        cell: ({ cell, row }) => (
          <div className="flex justify-end gap-2">
            <cell.Button
              nativeButton={false}
              render={<Link className="cursor-pointer" href={`/posts/${row.original.slug ?? row.original.id}`} target="_blank" />}
            >
              <EyeIcon />
            </cell.Button>
            <cell.Button nativeButton={false} render={<Link className="cursor-pointer" href={`/dashboard/posts/${row.original.id}`} />}>
              <PencilIcon />
            </cell.Button>
            <cell.ButtonDelete
              title={row.original.title}
              onConfirm={async () => {
                try {
                  await toastPromise(rpc.dashboard.posts({ id: row.original.id }).delete().then(unwrap), {
                    success: '删除成功'
                  })
                  await mutate(current => {
                    return produce(current, draft => {
                      draft?.posts.splice(row.index, 1)
                    })
                  }, data?.posts.length === 1)
                } catch (error) {
                  console.error(error)
                }
              }}
            />
          </div>
        )
      })
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const table = useAppTable({
    columns,
    data: data?.posts ?? [],
    manualPagination: true,
    pageCount: data?.pagination.pageCount ?? 0,
    state: {
      pagination
    },
    onPaginationChange: setPagination
  })

  return (
    <table.AppTable>
      <div className="space-y-4">
        <table.Table isLoading={isLoading} />
        <div className="flex items-center justify-end">
          <table.Pagination isLoading={isLoading} />
        </div>
      </div>
    </table.AppTable>
  )
}
