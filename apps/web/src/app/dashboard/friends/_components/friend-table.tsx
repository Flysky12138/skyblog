'use client'

import { Treaty } from '@elysiajs/eden'
import { Switch } from '@repo/ui/components/switch'
import { produce } from 'immer'
import { EyeIcon, PencilIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'

import { createAppColumnHelper, useAppTable } from '@/components/data-table/hooks'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { FriendEditModal } from './friend-edit-modal'

type RowData = Treaty.Data<typeof rpc.dashboard.friends.get>[number]

const columnHelper = createAppColumnHelper<RowData>()

export function FriendTable() {
  const { data, isLoading, mutate } = useSWR('0198eb99-caec-75cc-a4de-05dfa95cc14a', () => rpc.dashboard.friends.get().then(unwrap), {
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
        size: 150,
        cell: ({ getValue }) => <div className="truncate">{getValue()}</div>
      }),
      columnHelper.accessor('siteUrl', {
        header: '链接',
        size: 400,
        cell: ({ getValue }) => <div className="truncate">{getValue()}</div>
      }),
      columnHelper.accessor('description', {
        header: '描述',
        meta: {
          autoWidth: true
        },
        cell: ({ getValue }) => <div className="line-clamp-2 whitespace-normal">{getValue()}</div>
      }),
      columnHelper.accessor('isEnabled', {
        header: '公开',
        size: 60,
        cell: ({ row }) => (
          <div className="leading-0">
            <Switch
              checked={row.original.isEnabled}
              onCheckedChange={() => {
                void (async () => {
                  try {
                    const data = await toastPromise(
                      rpc.dashboard.friends({ id: row.original.id }).put({ isEnabled: !row.original.isEnabled }).then(unwrap),
                      {
                        success: '修改成功'
                      }
                    )
                    await mutate(current => {
                      return produce(current, draft => {
                        draft?.splice(row.index, 1, data)
                      })
                    }, false)
                  } catch (error) {
                    console.error(error)
                  }
                })
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
            <cell.Button nativeButton={false} render={<Link className="cursor-pointer" href={row.original.siteUrl} target="_blank" />}>
              <EyeIcon />
            </cell.Button>
            <FriendEditModal
              value={row.original}
              onSubmit={async body => {
                try {
                  const data = await toastPromise(rpc.dashboard.friends({ id: row.original.id }).put(body).then(unwrap), {
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
            </FriendEditModal>
            <cell.ButtonDelete
              title={row.original.name}
              onConfirm={async () => {
                try {
                  await toastPromise(rpc.dashboard.friends({ id: row.original.id }).delete().then(unwrap), {
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
          <FriendEditModal
            onSubmit={async body => {
              try {
                const data = await toastPromise(rpc.dashboard.friends.post(body).then(unwrap), {
                  success: '创建成功'
                })
                await mutate(current => {
                  return produce(current, draft => {
                    draft?.push(data)
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
          </FriendEditModal>
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
