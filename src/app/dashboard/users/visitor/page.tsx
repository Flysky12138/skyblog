'use client'

import { VisitorGetResponseType } from '@/app/api/dashboard/users/visitor/route'
import TableTbodyEmpty from '@/components/table/TableTbodyEmpty'
import TableTheadProgress from '@/components/table/TableTheadProgress'
import TableWrapper from '@/components/table/TableWrapper'
import { formatISOTime } from '@/lib/parser/time'
import { CustomFetch } from '@/lib/server/fetch'
import { Table } from '@mui/joy'
import { Pagination } from '@mui/material'
import React from 'react'
import useSWR from 'swr'

const getVisitors = async (page: number) => {
  return await CustomFetch<VisitorGetResponseType>(`/api/dashboard/users/visitor?take=${50}&page=${page}`)
}

export default function Page() {
  const [pageIndex, setPageIndex] = React.useState(1)

  const { isLoading, data: visitors } = useSWR(`api/dashboard/users/visitor?page=${pageIndex}`, () => getVisitors(pageIndex), {
    refreshInterval: 10 * 1000
  })

  const pageTotal = visitors ? Math.ceil(visitors.pagination.total / visitors.pagination.take) : 1

  return (
    <>
      <TableWrapper
        slotProps={{
          wrap: {
            className: 'max-h-[calc(100dvh-theme(height.28)-2px)]'
          }
        }}
      >
        <Table stickyHeader>
          <thead>
            <tr>
              <th className="w-10">#</th>
              <th className="w-36">Ip</th>
              <th className="w-60">Address</th>
              <th className="w-44">Lon/Lat</th>
              <th className="w-80">Agent</th>
              <th className="w-80">Referer</th>
              <th className="w-44">创建时间</th>
            </tr>
            <TableTheadProgress colSpan={7} loading={isLoading} />
          </thead>
          <tbody>
            {visitors?.data.map((visitor, index) => (
              <tr key={visitor.id}>
                <td>{index + 1}</td>
                <td>{visitor.ip}</td>
                <td className="break-all">{decodeURIComponent([visitor.country, visitor.countryRegion, visitor.city].filter(v => v).join('/'))}</td>
                <td>{[visitor.longitude, visitor.latitude].filter(v => v).join('/')}</td>
                <td className="break-all text-xs">{visitor.agent}</td>
                <td className="break-all">{visitor.referer}</td>
                <td>{formatISOTime(visitor.createdAt)}</td>
              </tr>
            ))}
            <TableTbodyEmpty colSpan={7} enable={visitors?.data.length == 0 && !isLoading} />
          </tbody>
        </Table>
      </TableWrapper>
      {pageTotal > 1 ? (
        <div className="mt-auto flex justify-center pt-4">
          <Pagination className="inline-block" count={pageTotal} page={pageIndex} onChange={(_, page) => setPageIndex(page)} />
        </div>
      ) : null}
    </>
  )
}
