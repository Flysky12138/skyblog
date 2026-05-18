'use client'

import { produce } from '@repo/react-hooks'
import { ColumnDef, getCoreRowModel, getSortedRowModel, Row, useReactTable } from '@tanstack/react-table'
import { PencilIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { ClashTemplateCreateBodyType, ClashTemplateUpdateBodyType } from '@/app/api/[[...elysia]]/dashboard/clashes/templates/model'
import { DataTable } from '@/components/data-table'
import { DataTableRowActionButton, DataTableRowDeleteButton } from '@/components/data-table/data-table-action'
import { getColumnConfig } from '@/components/data-table/utils'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { ClashTemplateEditModal } from './clash-template-edit-modal'
import { SWR_KEY_CLASH_TEMPLATES } from './utils'

export function ClashTemplateTable() {
  const {
    data: clashTemplates,
    isLoading,
    mutate
  } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => rpc.dashboard.clashes.templates.get().then(unwrap), {
    fallbackData: []
  })

  type RowData = Row<(typeof clashTemplates)[number]>

  // 创建
  const handleCreate = React.useEffectEvent(async (body: ClashTemplateCreateBodyType) => {
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
  })

  // 删除
  const handleDelete = React.useEffectEvent(async (row: RowData) => {
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
  })

  // 更新
  const handleUpdate = React.useEffectEvent(async (row: RowData, body: ClashTemplateUpdateBodyType) => {
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
  })

  const columns: ColumnDef<(typeof clashTemplates)[number]>[] = [
    getColumnConfig('index'),
    {
      accessorKey: 'name',
      header: '名称',
      size: 180,
      meta: {
        widthFit: true
      }
    },
    {
      accessorKey: '_count',
      header: '被使用',
      size: 100,
      meta: {
        align: 'center'
      },
      cell: ({ row }) => row.original._count.clashes
    },
    getColumnConfig('createdAt'),
    getColumnConfig('updatedAt'),
    {
      id: 'actions',
      size: 100,
      meta: {
        align: 'end'
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <ClashTemplateEditModal
            value={row.original}
            onSubmit={async body => {
              await handleUpdate(row, body)
            }}
          >
            <DataTableRowActionButton>
              <PencilIcon />
            </DataTableRowActionButton>
          </ClashTemplateEditModal>
          <DataTableRowDeleteButton
            title={row.original.name}
            onConfirm={async () => {
              await handleDelete(row)
            }}
          />
        </div>
      ),
      header: () => (
        <ClashTemplateEditModal onSubmit={handleCreate}>
          <DataTableRowActionButton>
            <PlusIcon />
          </DataTableRowActionButton>
        </ClashTemplateEditModal>
      )
    }
  ]

  const table = useReactTable({
    columns,
    data: clashTemplates,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}
