'use client'

import { Treaty } from '@elysiajs/eden'
import { produce } from 'immer'
import { PencilIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { createAppColumnHelper, useAppTable } from '@/components/data-table/hooks'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { POST_TAG_SWR_KEY } from '../utils'
import { PostTagEditModal } from './post-tag-edit-modal'

type RowData = Treaty.Data<typeof rpc.dashboard.posts.tags.get>[number]

const columnHelper = createAppColumnHelper<RowData>()

export function PostTagTable() {
  const { data, isLoading, mutate } = useSWR(POST_TAG_SWR_KEY, () => rpc.dashboard.posts.tags.get().then(unwrap), {
    fallbackData: []
  })

  const columns = React.useMemo(() => {
    return columnHelper.columns([
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
            <PostTagEditModal
              value={row.original}
              onSubmit={async body => {
                try {
                  const data = await toastPromise(rpc.dashboard.posts.tags({ id: row.original.id }).put(body).then(unwrap), {
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
            </PostTagEditModal>
            <cell.ButtonDelete
              title={row.original.name}
              onConfirm={async () => {
                try {
                  await toastPromise(rpc.dashboard.posts.tags({ id: row.original.id }).delete().then(unwrap), {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
