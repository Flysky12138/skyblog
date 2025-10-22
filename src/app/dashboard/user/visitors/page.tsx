'use client'

import { Eye } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { GET } from '@/app/api/dashboard/user/visitors/route'
import { AlertDelete } from '@/components/alert-delete'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Pagination } from '@/components/pagination'
import { Table, TableActionButton } from '@/components/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomRequest } from '@/lib/http/request'
import { formatISOTime } from '@/lib/parser/time'
import { Toast } from '@/lib/toast'

const MDXClient = dynamic(() => import('@/components/mdx/client').then(it => it.MDXClient), {
  ssr: false,
  loading: () => <Skeleton className="h-48" />
})

export default function Page() {
  const [search, setSearch] = useImmer<GET['search']>({ limit: 20, page: 1 })
  const [checked, setChecked] = React.useState<GET['return']['result']>([])

  const { data, isLoading, mutate } = useSWR(
    ['0198eb9a-1aa7-77d8-9b1d-0f0f7efb4130', search],
    () => CustomRequest('GET /api/dashboard/user/visitors', { search }),
    {
      keepPreviousData: true,
      refreshInterval: 10 * 1000
    }
  )

  React.useEffect(() => {
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }, [data?.page])

  return (
    <div className="space-y-4">
      <Table
        columns={[
          { key: 'section' },
          { key: 'index' },
          { dataIndex: 'ip', title: 'Ip' },
          {
            key: 'address',
            title: 'Address',
            render: ({ geo }) => decodeURIComponent([geo.country, geo.countryRegion, geo.city].filter(Boolean).join('/'))
          },
          { key: 'lon/lat', title: 'Lon/Lat', render: ({ geo }) => [geo.longitude, geo.latitude].filter(Boolean).join('/') },
          { key: 'device', title: 'Device', render: ({ agent }) => agent.device.vendor },
          { dataIndex: 'createdAt', headerClassName: 'w-44', render: formatISOTime, title: '创建时间' },
          {
            align: 'right',
            headerClassName: 'w-16',
            key: 'detail',
            title: '详情',
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
                      <DialogTitle>访客信息</DialogTitle>
                      <DialogDescription className="hidden" />
                    </DialogHeader>
                    <div className="text-sm *:m-0 [&_span[data-line]]:whitespace-pre-wrap">
                      <MDXClient
                        loadingRender={<Skeleton className="h-48" />}
                        source={['```json', JSON.stringify(record, null, 2), '```'].join('\n')}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )
          }
        ]}
        dataSource={data?.result}
        loading={isLoading}
        rowSelection={{
          selectedRows: checked,
          onChange: setChecked
        }}
      />
      <div className="flex items-center justify-between">
        <DisplayByConditional condition={checked.length > 0}>
          <AlertDelete
            description={`将永久删除 ${checked?.length} 项。`}
            title="访客信息"
            onConfirm={async () => {
              await Toast(CustomRequest('DELETE /api/dashboard/user/visitors', { body: { ids: checked.map(it => it.id) } }), {
                success: '删除成功'
              })
              setChecked([])
              await mutate()
            }}
          >
            <Button size="sm" variant="destructive">
              已选择 {checked?.length} 项
            </Button>
          </AlertDelete>
        </DisplayByConditional>
        <DisplayByConditional condition={(data?.totalPages || 0) > 1}>
          <Pagination
            className="justify-end"
            onChange={payload => {
              setChecked([])
              setSearch(payload)
            }}
            {...data}
          />
        </DisplayByConditional>
      </div>
    </div>
  )
}
