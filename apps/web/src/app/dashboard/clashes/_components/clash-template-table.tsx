'use client'

import { Treaty } from '@elysiajs/eden'
import { produce } from 'immer'
import { PencilIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { createAppColumnHelper, useAppTable } from '@/components/data-table/hooks'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { ClashTemplateEditModal } from './clash-template-edit-modal'
import { SWR_KEY_CLASH_TEMPLATES } from './utils'

type RowData = Treaty.Data<typeof rpc.dashboard.clashes.templates.get>[number]

const columnHelper = createAppColumnHelper<RowData>()

export function ClashTemplateTable() {
  const { data, isLoading, mutate } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => rpc.dashboard.clashes.templates.get().then(unwrap), {
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
        header: '名称',
        size: 180,
        meta: {
          autoWidth: true
        }
      }),
      columnHelper.accessor('_count.clashes', {
        header: '被使用',
        size: 100,
        meta: {
          align: 'center'
        }
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
      columnHelper.accessor('updatedAt', {
        header: '更新时间',
        size: 180,
        sortFn: 'datetime',
        meta: {
          enableSorting: true
        },
        cell: ({ cell }) => <cell.Date />
      }),
      columnHelper.display({
        id: 'actions',
        size: 100,
        meta: {
          align: 'end'
        },
        cell: ({ cell, row }) => (
          <div className="flex justify-end gap-2">
            <ClashTemplateEditModal
              value={row.original}
              onSubmit={async body => {
                try {
                  const data = await toastPromise(rpc.dashboard.clashes.templates({ id: row.original.id }).put(body).then(unwrap), {
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
            </ClashTemplateEditModal>
            <cell.ButtonDelete
              title={row.original.name}
              onConfirm={async () => {
                try {
                  await toastPromise(rpc.dashboard.clashes.templates({ id: row.original.id }).delete().then(unwrap), {
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
        ),
        header: ({ header }) => (
          <ClashTemplateEditModal
            onSubmit={async body => {
              try {
                const data = await toastPromise(rpc.dashboard.clashes.templates.post(body).then(unwrap), {
                  success: '创建成功'
                })
                await mutate(current => {
                  return produce(current, draft => {
                    draft?.unshift(data)
                  })
                }, false)
              } catch (error) {
                console.error(error)
              }
            }}
          >
            <header.Button>
              <PlusIcon />
            </header.Button>
          </ClashTemplateEditModal>
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
