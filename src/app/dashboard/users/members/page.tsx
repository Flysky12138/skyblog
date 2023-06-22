'use client'

import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { BadgeCheck, BadgeX } from 'lucide-react'
import useSWR from 'swr'

import { DataTable } from '@/components/data-table'
import { getColumnConfig } from '@/components/data-table/utils'
import { Switch } from '@/components/ui/switch'
import { rpc, unwrap } from '@/lib/http/rpc'

export default function Page() {
  const { data: members, isLoading } = useSWR('0198eb99-fb3f-756e-9a2a-9e0a2eebed86', () => rpc.dashboard.users.members.get().then(unwrap), {
    fallbackData: []
  })

  const columns: ColumnDef<(typeof members)[number]>[] = [
    getColumnConfig('selection'),
    getColumnConfig('index'),
    {
      accessorKey: 'name',
      header: '验证',
      size: 60,
      cell: ({ row }) =>
        row.original.emailVerified ? <BadgeCheck className="text-green-500" size={16} /> : <BadgeX className="text-pink-500" size={16} />
    },
    {
      accessorKey: 'name',
      header: '用户名',
      size: 100,
      meta: {
        widthFit: true
      }
    },
    {
      accessorKey: 'email',
      header: '邮箱',
      size: 200
    },
    { accessorKey: 'role', header: '权限', size: 80 },
    {
      accessorKey: 'banned',
      header: '封禁',
      size: 80,
      cell: ({ row }) => (
        <div className="leading-0">
          <Switch disabled checked={row.original.banned ?? false} />
        </div>
      )
    },
    getColumnConfig('updatedAt'),
    getColumnConfig('createdAt')
  ]

  const table = useReactTable({
    columns,
    data: members,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      isLoading
    },
    getRowId: row => row.id
  })

  return <DataTable table={table} />
}
