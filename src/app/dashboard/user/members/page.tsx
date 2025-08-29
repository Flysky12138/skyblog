'use client'

import useSWR from 'swr'

import { Table } from '@/components/table'
import { CustomRequest } from '@/lib/http/request'
import { formatISOTime } from '@/lib/parser/time'

export default function Page() {
  const { data: members, isLoading } = useSWR('0198eb99-fb3f-756e-9a2a-9e0a2eebed86', () => CustomRequest('GET /api/dashboard/user/members', {}), {
    fallbackData: []
  })

  return (
    <Table
      columns={[
        { dataIndex: 'name', title: '名字' },
        { dataIndex: 'email', title: '邮箱' },
        { dataIndex: 'role', title: '权限' },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        { dataIndex: 'createdAt', render: formatISOTime, title: '创建时间' }
      ]}
      dataSource={members}
      loading={isLoading}
    />
  )
}
