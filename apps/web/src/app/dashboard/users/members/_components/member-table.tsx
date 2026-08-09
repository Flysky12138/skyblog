'use client'

import { Switch } from '@repo/ui/components/switch'
import { BadgeCheckIcon, BadgeXIcon } from 'lucide-react'
import useSWR from 'swr'

import { createAppColumnHelper, useAppTable } from '@/components/data-table/hooks'
import { rpc, unwrap } from '@/lib/http/rpc'

export function MemberTable() {
  const { data, isLoading } = useSWR('0198eb99-fb3f-756e-9a2a-9e0a2eebed86', () => rpc.dashboard.users.members.get().then(unwrap), {
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
    columnHelper.accessor('emailVerified', {
      header: '验证',
      size: 60,
      cell: ({ getValue }) =>
        getValue() ? <BadgeCheckIcon className="text-green-500" size={16} /> : <BadgeXIcon className="text-pink-500" size={16} />
    }),
    columnHelper.accessor('name', {
      header: '用户名',
      size: 100,
      meta: {
        autoWidth: true
      }
    }),
    columnHelper.accessor('email', {
      header: '邮箱',
      size: 200
    }),
    columnHelper.accessor('role', {
      header: '权限',
      size: 80
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
    columnHelper.accessor('banned', {
      header: '封禁',
      size: 60,
      cell: ({ getValue }) => (
        <div className="leading-0">
          <Switch disabled checked={getValue() ?? false} />
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
