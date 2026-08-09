'use client'

import { produce } from 'immer'
import { PencilIcon } from 'lucide-react'
import useSWR from 'swr'

import { createAppColumnHelper, useAppTable } from '@/components/data-table/hooks'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { POST_CATEGORY_SWR_KEY } from '../utils'
import { PostCategoryEditModal } from './post-category-edit-modal'

export function PostCategoryTable() {
  const { data, isLoading, mutate } = useSWR(POST_CATEGORY_SWR_KEY, () => rpc.dashboard.posts.categories.get().then(unwrap), {
    fallbackData: []
  })

  type RowData = (typeof data)[number]

  const columnHelper = createAppColumnHelper<RowData>()

  const columns = columnHelper.columns([
    columnHelper.display({
      header: '#',
      id: 'idnex',
      size: 42,
      cell: ({ row }) => row.getDisplayIndex() + 1
    }),
    columnHelper.accessor('name', {
      header: '标题',
      size: 120,
      meta: {
        autoWidth: true
      }
    }),
    columnHelper.accessor('updatedAt', {
      header: '更新时间',
      size: 180,
      sortFn: 'datetime',
      meta: {
        enableSorting: true
      },
      cell: ({ cell }) => <cell.Date />
    }),
    columnHelper.accessor('createdAt', {
      header: '创建时间',
      size: 180,
      sortFn: 'datetime',
      meta: {
        enableSorting: true
      },
      cell: ({ cell }) => <cell.Date />
    }),
    columnHelper.display({
      header: '操作',
      id: 'actions',
      size: 100,
      meta: {
        align: 'end'
      },
      cell: ({ cell, row }) => (
        <div className="flex justify-end gap-2">
          <PostCategoryEditModal
            value={row.original}
            onSubmit={async body => {
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
            }}
          >
            <cell.Button>
              <PencilIcon />
            </cell.Button>
          </PostCategoryEditModal>
          <cell.ButtonDelete
            title={row.original.name}
            onConfirm={async () => {
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
            }}
          />
        </div>
      )
    })
  ])

  const table = useAppTable({
    columns,
    data
  })

  return (
    <table.AppTable>
      <table.Table isLoading={isLoading} />
    </table.AppTable>
  )
}
