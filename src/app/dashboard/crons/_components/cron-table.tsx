'use client'

import { Treaty } from '@elysiajs/eden'
import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { produce } from 'immer'
import { PencilIcon, PlayIcon, PlusIcon } from 'lucide-react'
import { useAsyncFn } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'

import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { getColumnConfig } from '@/components/data-table/utils'
import { Switch } from '@/components/ui/switch'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { CronEditModal } from './cron-edit-modal'

export function CronTable() {
  const {
    data: crons,
    isLoading,
    mutate
  } = useSWR('019dd3e1-517a-74ed-8435-8f4ff96ddd0c', () => rpc.dashboard.crons.get().then(unwrap), {
    fallbackData: []
  })

  const columns: ColumnDef<(typeof crons)[number]>[] = [
    getColumnConfig('index'),
    {
      accessorKey: 'name',
      header: '名称',
      size: 250,
      meta: {
        widthFit: true
      }
    },
    {
      accessorKey: 'isEnabled',
      header: '开关',
      size: 80,
      cell: ({ row }) => (
        <div className="leading-0">
          <DataTableRowUpdateButton
            row={row.original}
            onChange={async data => {
              await mutate(
                produce<typeof crons>(draft => {
                  draft.splice(row.index, 1, data)
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
    getColumnConfig('updatedAt'),
    getColumnConfig('createdAt'),
    {
      id: 'actions',
      size: 140,
      meta: {
        align: 'end'
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <DataTableRowRunButton row={row.original} />
          <CronEditModal
            value={row.original}
            onSubmit={async body => {
              const data = await toastPromise(rpc.dashboard.crons({ id: row.original.id }).put(body).then(unwrap), {
                success: '修改成功'
              })
              await mutate(
                produce<typeof crons>(draft => {
                  draft.splice(row.index, 1, data)
                }),
                {
                  revalidate: false
                }
              )
            }}
          >
            <DataTableRowActionButton>
              <PencilIcon />
            </DataTableRowActionButton>
          </CronEditModal>
          <DataTableRowDeleteButton
            description="将永久删除该项。"
            title={row.original.name}
            onConfirm={async () => {
              await toastPromise(rpc.dashboard.crons({ id: row.original.id }).delete(), {
                success: '删除成功'
              })
              await mutate(
                produce<typeof crons>(draft => {
                  draft.splice(row.index, 1)
                }),
                {
                  revalidate: false
                }
              )
            }}
          />
        </div>
      ),
      header: () => (
        <CronEditModal
          onSubmit={async body => {
            const data = await toastPromise(rpc.dashboard.crons.post(body).then(unwrap), {
              success: '添加成功'
            })
            await mutate(
              produce<typeof crons>(draft => {
                draft.unshift(data)
              }),
              {
                revalidate: false
              }
            )
          }}
        >
          <DataTableRowActionButton>
            <PlusIcon />
          </DataTableRowActionButton>
        </CronEditModal>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data: crons,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}

function DataTableRowRunButton({ row }: { row: Treaty.Data<ReturnType<typeof rpc.dashboard.crons>['get']> }) {
  const [{ loading }, handleRun] = useAsyncFn(async () => {
    await rpc.dashboard.crons({ id: row.id }).run.post().then(unwrap)
    toast.success('执行成功')
  }, [row.id])

  return (
    <DataTableRowActionButton disabled={!row.isEnabled} loading={loading} onClick={handleRun}>
      <PlayIcon />
    </DataTableRowActionButton>
  )
}

function DataTableRowUpdateButton({
  row,
  onChange
}: {
  row: Treaty.Data<ReturnType<typeof rpc.dashboard.crons>['get']>
  onChange: (data: Treaty.Data<ReturnType<typeof rpc.dashboard.crons>['get']>) => Promise<void>
}) {
  const [{ loading }, handleChange] = useAsyncFn(async () => {
    const data = await toastPromise(rpc.dashboard.crons({ id: row.id }).put({ isEnabled: !row.isEnabled }).then(unwrap), {
      success: '更新成功'
    })
    await onChange(data)
  }, [row, onChange])

  return <Switch checked={row.isEnabled} disabled={loading} onCheckedChange={handleChange} />
}
