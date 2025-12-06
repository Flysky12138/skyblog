'use client'

import useSWR from 'swr'

import { Table } from '@/components/table'
import { Switch } from '@/components/ui/switch'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatISOTime } from '@/lib/parser/time'
import { tw } from '@/lib/utils'

export default function Page() {
  const { data: members, isLoading } = useSWR('0198eb99-fb3f-756e-9a2a-9e0a2eebed86', () => rpc.dashboard.users.members.get().then(unwrap), {
    fallbackData: []
  })

  return (
    <Table
      columns={[
        { dataIndex: 'name', title: '名字', width: 100, widthFit: true },
        { dataIndex: 'email', title: '邮箱', width: 200 },
        { dataIndex: 'role', title: '权限', width: 80 },
        {
          className: tw`leading-0`,
          dataIndex: 'banned',
          title: '封禁',
          width: 60,
          render: text => <Switch disabled checked={text ?? false} />
        },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        { dataIndex: 'createdAt', render: formatISOTime, title: '创建时间' }
      ]}
      dataSource={members}
      loading={isLoading}
    />
  )
}
