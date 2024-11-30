'use client'

import Table from '@/components/table/Table'
import TableStatus from '@/components/table/TableStatus'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import useSWR from 'swr'

export default function Page() {
  const { data: members, isLoading } = useSWR('/api/dashboard/users/member', () => CustomRequest('GET api/dashboard/users/member', {}), {
    fallbackData: []
  })

  return (
    <Table>
      <thead>
        <tr>
          <th className="w-10">#</th>
          <th className="w-40">名字</th>
          <th className="w-60">邮箱</th>
          <th className="w-32">权限</th>
          <th className="w-44">更新时间</th>
          <th className="w-44">创建时间</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={member.id}>
            <td>{index + 1}</td>
            <td>{member.name}</td>
            <td>{member.email}</td>
            <td>{member.role}</td>
            <td>{formatISOTime(member.updatedAt)}</td>
            <td>{formatISOTime(member.createdAt)}</td>
          </tr>
        ))}
        <TableStatus colSpan={6} isEmpty={members.length == 0} isLoading={isLoading} />
      </tbody>
    </Table>
  )
}
