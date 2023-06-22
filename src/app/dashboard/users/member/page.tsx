'use client'

import { MemberGetResponseType } from '@/app/api/dashboard/users/member/route'
import TableTbodyEmpty from '@/components/table/TableTbodyEmpty'
import TableTheadProgress from '@/components/table/TableTheadProgress'
import TableWrapper from '@/components/table/TableWrapper'
import { formatISOTime } from '@/lib/parser/time'
import { CustomFetch } from '@/lib/server/fetch'
import { Table } from '@mui/joy'
import useSWR from 'swr'

const getMembers = async () => {
  return await CustomFetch<MemberGetResponseType>('/api/dashboard/users/member')
}

export default function Page() {
  const { data: members, isLoading } = useSWR('/api/dashboard/users/member', getMembers, {
    fallbackData: []
  })

  return (
    <TableWrapper>
      <Table stickyFooter stickyHeader>
        <thead>
          <tr>
            <th className="w-10">#</th>
            <th className="w-40">名字</th>
            <th className="w-60">邮箱</th>
            <th className="w-32">权限</th>
            <th className="w-44">更新时间</th>
            <th className="w-44">创建时间</th>
          </tr>
          <TableTheadProgress colSpan={6} loading={isLoading} />
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
          <TableTbodyEmpty colSpan={6} enable={members.length == 0 && !isLoading} />
        </tbody>
      </Table>
    </TableWrapper>
  )
}
