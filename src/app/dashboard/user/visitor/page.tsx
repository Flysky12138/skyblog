'use client'

import TableStatus from '@/components/table/TableStatus'
import TableWrapper from '@/components/table/TableWrapper'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Table } from '@mui/joy'
import { Pagination } from '@mui/material'
import React from 'react'
import useSWR from 'swr'

export default function Page() {
  const [page, setPage] = React.useState(1)

  const { isLoading, data: visitors } = useSWR(
    `api/dashboard/users/visitor?page=${page}`,
    () =>
      CustomRequest('GET api/dashboard/users/visitor', {
        search: {
          page,
          take: 50
        }
      }),
    {
      refreshInterval: 10 * 1000
    }
  )

  const pageTotal = visitors ? Math.ceil(visitors.pagination.total / visitors.pagination.take) : 1

  return (
    <>
      <TableWrapper
        slotProps={{
          sheet: {
            className: 'max-h-[calc(100dvh-theme(height.28)-2px)]'
          }
        }}
      >
        <Table stickyFooter stickyHeader>
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 w-10 border-r">#</th>
              <th className="w-36 border-l">Ip</th>
              <th className="w-60">Address</th>
              <th className="w-44">Lon/Lat</th>
              <th className="w-44">Device</th>
              <th className="w-80">Referer</th>
              <th className="w-44">创建时间</th>
            </tr>
          </thead>
          <tbody>
            {visitors?.data.map((visitor, index) => (
              <tr key={visitor.id}>
                <td className="s-bg-content sticky left-0 z-20 border-r">{index + 1}</td>
                <td className="border-l">{visitor.ip}</td>
                <td className="truncate">{decodeURIComponent([visitor.geo.country, visitor.geo.countryRegion, visitor.geo.city].filter(v => v).join('/'))}</td>
                <td>{[visitor.geo.longitude, visitor.geo.latitude].filter(v => v).join('/')}</td>
                <td>{visitor.agent.device.model}</td>
                <td className="truncate">{visitor.referer}</td>
                <td>{formatISOTime(visitor.createdAt)}</td>
              </tr>
            ))}
            <TableStatus colSpan={7} isEmpty={visitors?.data.length == 0} isLoading={isLoading} />
          </tbody>
        </Table>
      </TableWrapper>
      {pageTotal > 1 ? (
        <div className="mt-auto flex justify-end pt-4">
          <Pagination className="inline-block" count={pageTotal} page={page} onChange={(_, p) => setPage(p)} />
        </div>
      ) : null}
    </>
  )
}
