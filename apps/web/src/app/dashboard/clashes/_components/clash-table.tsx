'use client'

import { Treaty } from '@elysiajs/eden'
import { useCopy } from '@repo/react-hooks'
import { toast } from '@repo/ui/base'
import { Switch } from '@repo/ui/components/switch'
import { produce } from 'immer'
import { CopyIcon, PencilIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { createAppColumnHelper, useAppTable } from '@/components/data-table/hooks'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { ClashEditModal } from './clash-edit-modal'

type RowData = Treaty.Data<typeof rpc.dashboard.clashes.get>[number]

const columnHelper = createAppColumnHelper<RowData>()

export function ClashTable() {
  const { copy } = useCopy({
    onCopy: () => {
      toast.success('复制成功')
    }
  })

  const { data, isLoading, mutate } = useSWR('0198eb98-3acc-70ab-82f3-14d5ca929785', () => rpc.dashboard.clashes.get().then(unwrap), {
    fallbackData: [],
    refreshInterval: 10_000
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
        size: 180
      }),
      columnHelper.accessor('description', {
        header: '描述',
        size: 200,
        meta: {
          autoWidth: true
        }
      }),
      columnHelper.accessor(data => data.activityLogs.length, {
        header: '次数',
        id: 'count',
        size: 80,
        meta: {
          align: 'center'
        }
      }),
      columnHelper.accessor(data => data.activityLogs[0]?.createdAt, {
        header: '最近订阅时间',
        id: 'lastAt',
        size: 180,
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
      columnHelper.accessor('isEnabled', {
        header: '启用',
        size: 60,
        cell: ({ getValue, row }) => (
          <div className="leading-0">
            <Switch
              checked={getValue()}
              onCheckedChange={() => {
                void (async () => {
                  try {
                    const clash = await toastPromise(
                      rpc.dashboard.clashes({ id: row.original.id }).put({ isEnabled: !row.original.isEnabled }).then(unwrap),
                      {
                        success: '修改成功'
                      }
                    )
                    await mutate(current => {
                      return produce(current, draft => {
                        draft?.splice(row.index, 1, clash)
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
        id: 'actions',
        size: 140,
        meta: {
          align: 'end'
        },
        cell: ({ cell, row }) => (
          <div className="flex justify-end gap-2">
            <cell.Button
              onClick={() => {
                copy(new URL(`/api/clashes/${row.original.id}`, window.origin).href)
              }}
            >
              <CopyIcon />
            </cell.Button>
            <ClashEditModal
              value={row.original}
              onSubmit={async body => {
                try {
                  const data = await toastPromise(rpc.dashboard.clashes({ id: row.original.id }).put(body).then(unwrap), {
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
            </ClashEditModal>
            <cell.ButtonDelete
              title={row.original.name}
              onConfirm={async () => {
                try {
                  await toastPromise(rpc.dashboard.clashes({ id: row.original.id }).delete().then(unwrap), {
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
          <ClashEditModal
            onSubmit={async body => {
              try {
                const data = await toastPromise(rpc.dashboard.clashes.post(body).then(unwrap), {
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
          </ClashEditModal>
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
