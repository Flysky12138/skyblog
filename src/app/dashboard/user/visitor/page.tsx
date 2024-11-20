'use client'

import { MDXClient } from '@/components/mdx/client'
import ModalCore from '@/components/modal/ModalCore'
import ModalDelete from '@/components/modal/ModalDelete'
import PaginationTable, { PaginationSearch } from '@/components/pagination/PaginationTable'
import TableStatus from '@/components/table/TableStatus'
import TableWrapper from '@/components/table/TableWrapper'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { MoreHoriz } from '@mui/icons-material'
import { Button, Checkbox, IconButton, Table } from '@mui/joy'
import { useSet } from 'react-use'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

export default function Page() {
  const [search, setSearch] = useImmer<PaginationSearch>({ limit: 20, page: 1 })

  const {
    data: visitors,
    mutate,
    isLoading
  } = useSWR(`/api/dashboard/users/visitor?limit=${search.limit}&page=${search.page}`, () => CustomRequest('GET api/dashboard/users/visitor', { search }), {
    keepPreviousData: true,
    refreshInterval: 10 * 1000
  })

  const [checked, setChecked] = useSet<string>()

  return (
    <>
      <TableWrapper>
        <Table stickyFooter stickyHeader>
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 w-10 border-r text-center align-middle leading-none">
                {!visitors || visitors.result.length == 0 ? (
                  <Checkbox disabled checked={false} />
                ) : (
                  <Checkbox
                    checked={checked.size == visitors.result.length}
                    indeterminate={checked.size > 0 && checked.size !== visitors.result.length}
                    onChange={() => {
                      checked.size < visitors.result.length ? visitors.result.forEach(it => setChecked.add(it.id)) : setChecked.clear()
                    }}
                  />
                )}
              </th>
              <th className="w-36 border-l">Ip</th>
              <th className="w-60">Address</th>
              <th className="w-44">Lon/Lat</th>
              <th className="w-44">Device</th>
              <th className="w-44">创建时间</th>
              <th className="w-12 text-end">详情</th>
            </tr>
          </thead>
          <tbody>
            {visitors?.result.map(visitor => (
              <tr key={visitor.id}>
                <td className="s-bg-content sticky left-0 z-20 border-r text-center align-middle leading-none">
                  <Checkbox
                    checked={checked.has(visitor.id)}
                    onChange={() => {
                      setChecked.toggle(visitor.id)
                    }}
                  />
                </td>
                <td className="border-l">{visitor.ip}</td>
                <td className="truncate">{decodeURIComponent([visitor.geo.country, visitor.geo.countryRegion, visitor.geo.city].filter(v => v).join('/'))}</td>
                <td>{[visitor.geo.longitude, visitor.geo.latitude].filter(v => v).join('/')}</td>
                <td>{visitor.agent.device.vendor}</td>
                <td>{formatISOTime(visitor.createdAt)}</td>
                <td className="text-end">
                  <ModalCore
                    className="p-0"
                    component={props => (
                      <IconButton size="sm" variant="plain" {...props}>
                        <MoreHoriz />
                      </IconButton>
                    )}
                  >
                    <div className="max-w-screen-md">
                      <MDXClient value={'```json expand\n' + JSON.stringify(visitor, null, ' '.repeat(2)) + '\n```'} />
                    </div>
                  </ModalCore>
                </td>
              </tr>
            ))}
            <TableStatus colSpan={7} isEmpty={visitors?.result.length == 0} isLoading={isLoading} />
          </tbody>
        </Table>
      </TableWrapper>
      <div className="flex pt-4">
        {checked.size > 0 && (
          <ModalDelete
            component={props => (
              <Button className="tracking-widest text-inherit" size="sm" variant="soft" {...props}>
                已选择 <span className="px-1 text-[--joy-palette-primary-solidBg]">{checked.size}</span> 项
              </Button>
            )}
            onSubmit={async () => {
              await Toast(
                CustomRequest('DELETE api/dashboard/users/visitor', {
                  body: {
                    ids: Array.from(checked.values())
                  }
                }),
                {
                  success: '删除成功'
                }
              )
              setChecked.clear()
              await mutate()
            }}
          />
        )}
        <PaginationTable className="ml-auto" count={visitors?.totalPages || 1} {...search} onChange={setSearch} />
      </div>
    </>
  )
}
