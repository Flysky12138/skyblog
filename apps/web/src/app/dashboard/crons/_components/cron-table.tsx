'use client'

import { Treaty } from '@elysiajs/eden'
import { useCopy } from '@repo/react-hooks'
import { toast } from '@repo/ui/base'
import { Switch } from '@repo/ui/components/switch'
import { produce } from 'immer'
import { CopyIcon, PencilIcon, PlayIcon, PlusIcon } from 'lucide-react'
import { useAsyncFn } from 'react-use'
import useSWR from 'swr'

import { DataTableRowActionButton } from '@/components/data-table/components/action'
import { createAppColumnHelper, useAppTable } from '@/components/data-table/hooks'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { CronEditModal } from './cron-edit-modal'

export function CronTable() {
  const { copy } = useCopy({
    onCopy: () => {
      toast.success('复制成功')
    }
  })

  const { data, isLoading, mutate } = useSWR('019dd3e1-517a-74ed-8435-8f4ff96ddd0c', () => rpc.dashboard.crons.get().then(unwrap), {
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
      header: '名称',
      size: 250,
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
    columnHelper.accessor('isEnabled', {
      header: '开关',
      size: 60,
      cell: ({ getValue, row }) => (
        <div className="leading-0">
          <Switch
            checked={getValue()}
            onCheckedChange={() => {
              void (async () => {
                try {
                  const data = await toastPromise(
                    rpc.dashboard.crons({ id: row.original.id }).put({ isEnabled: !row.original.isEnabled }).then(unwrap),
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
              })()
            }}
          />
        </div>
      )
    }),
    columnHelper.display({
      id: 'actions',
      size: 160,
      meta: {
        align: 'end'
      },
      cell: ({ cell, row }) => (
        <div className="flex justify-end gap-2">
          <DataTableRowRunButton row={row.original} />
          <cell.Button
            onClick={() => {
              copy(new URL(`/api/crons/${row.original.id}`, window.origin).href)
            }}
          >
            <CopyIcon />
          </cell.Button>
          <CronEditModal
            value={row.original}
            onSubmit={async body => {
              try {
                const data = await toastPromise(rpc.dashboard.crons({ id: row.original.id }).put(body).then(unwrap), {
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
          </CronEditModal>
          <cell.ButtonDelete
            title={row.original.name}
            onConfirm={async () => {
              try {
                await toastPromise(rpc.dashboard.crons({ id: row.original.id }).delete().then(unwrap), {
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
        <CronEditModal
          onSubmit={async body => {
            try {
              const data = await toastPromise(rpc.dashboard.crons.post(body).then(unwrap), {
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
        </CronEditModal>
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

// 运行按键
function DataTableRowRunButton({ row }: { row: Treaty.Data<ReturnType<typeof rpc.dashboard.crons>['get']> }) {
  const [{ loading }, handleRun] = useAsyncFn(async () => {
    try {
      await toastPromise(rpc.dashboard.crons({ id: row.id }).run.post().then(unwrap), {
        descriptionClassName: 'whitespace-pre-wrap mt-2',
        success: '执行成功',
        description: ({ data }) => (typeof data === 'object' ? JSON.stringify(data, null, 4) : String(data))
      })
    } catch (error) {
      console.error(error)
    }
  }, [row.id])

  return (
    <DataTableRowActionButton
      disabled={!row.isEnabled}
      loading={loading}
      onClick={() => {
        void handleRun()
      }}
    >
      <PlayIcon />
    </DataTableRowActionButton>
  )
}
