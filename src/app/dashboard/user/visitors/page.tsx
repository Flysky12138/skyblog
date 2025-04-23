'use client'

import { GET } from '@/app/api/dashboard/user/visitors/route'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Pagination } from '@/components/pagination'
import { Table, TableActionButton } from '@/components/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CustomRequest } from '@/lib/http/request'
import { formatISOTime } from '@/lib/parser/time'
import { Eye } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSet } from 'react-use'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

const MDXClient = dynamic(() => import('@/components/mdx/client').then(it => it.MDXClient), {
  loading: () => <div className="skeleton h-20 rounded-md" />,
  ssr: false
})

export default function Page() {
  const [search, setSearch] = useImmer<GET['search']>({ limit: 20, page: 1 })

  const { data, isLoading, mutate } = useSWR(
    ['9670f632-f40e-5695-b0c6-5cb539b4a957', search],
    () => CustomRequest('GET api/dashboard/user/visitors', { search }),
    {
      keepPreviousData: true,
      refreshInterval: 10 * 1000
    }
  )

  const [checked, setChecked] = useSet<string>()

  return (
    <section className="space-y-4">
      <Table
        columns={[
          { key: 'index' },
          { dataIndex: 'ip', title: 'Ip' },
          {
            key: 'address',
            render: ({ geo }) => decodeURIComponent([geo.country, geo.countryRegion, geo.city].filter(Boolean).join('/')),
            title: 'Address'
          },
          { key: 'lon/lat', render: ({ geo }) => [geo.longitude, geo.latitude].filter(Boolean).join('/'), title: 'Lon/Lat' },
          { key: 'device', render: ({ agent }) => agent.device.vendor, title: 'Device' },
          { dataIndex: 'createdAt', headerClassName: 'w-44', render: formatISOTime, title: '创建时间' },
          {
            align: 'right',
            headerClassName: 'w-16',
            key: 'detail',
            render: record => (
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <TableActionButton>
                      <Eye />
                    </TableActionButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>访客</DialogTitle>
                      <DialogDescription>访客的全部信息</DialogDescription>
                    </DialogHeader>
                    <div className="[&_span]:break-all [&_span]:whitespace-pre-wrap">
                      <MDXClient value={'```json\n' + JSON.stringify(record, null, 2) + '\n```'} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ),
            title: '详情'
          }
        ]}
        dataSource={data?.result}
        loading={isLoading}
      />
      <DisplayByConditional condition={(data?.totalPages || 0) > 1}>
        <Pagination className="justify-end" onChange={setSearch} {...data} />
      </DisplayByConditional>
      {/* <div className="flex pt-4">
        <DisplayByConditional condition={checked.size > 0}>
          <ModalDelete
            component={props => (
              <Button className="tracking-widest text-inherit" size="icon" variant="outline" {...props}>
                已选择 <span className="px-1 text-(--joy-palette-primary-solidBg)">{checked.size}</span> 项
              </Button>
            )}
            onSubmit={async () => {
              await Toast(CustomRequest('DELETE api/dashboard/users/visitor', { body: { ids: Array.from(checked.values()) } }), {
                success: '删除成功'
              })
              setChecked.clear()
              await mutate()
            }}
          />
        </DisplayByConditional>
      </div> */}
    </section>
  )
}
