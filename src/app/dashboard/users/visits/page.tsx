'use client'

import { Treaty } from '@elysiajs/eden'
import { Eye } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { PaginationQueryType } from '@/app/api/[[...slug]]/model'
import { AlertDelete } from '@/components/alert-delete'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Pagination } from '@/components/pagination'
import { Table, TableActionButton } from '@/components/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatISOTime } from '@/lib/parser/time'
import { rpc, unwrap } from '@/lib/rpc'
import { toastPromise } from '@/lib/toast'

const limit = 20

const MDXClient = dynamic(() => import('@/components/mdx/client').then(it => it.MDXClient), {
  ssr: false,
  loading: () => <Skeleton className="h-48" />
})

export default function Page() {
  const [query, setQuery] = useImmer<PaginationQueryType>({ limit, page: 1 })
  const [checked, setChecked] = React.useState<Treaty.Data<typeof rpc.dashboard.users.visits.get>['visits']>([])

  const { data, isLoading, mutate } = useSWR(
    ['0198eb9a-1aa7-77d8-9b1d-0f0f7efb4130', query],
    () => rpc.dashboard.users.visits.get({ query }).then(unwrap),
    {
      keepPreviousData: true,
      refreshInterval: 10 * 1000
    }
  )

  React.useEffect(() => {
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }, [data?.pagination.currentPage])

  return (
    <div className="space-y-4">
      <Table
        columns={[
          { key: 'section' },
          { key: 'index' },
          { dataIndex: 'ip', title: 'Ip', width: 140, widthFit: true },
          { align: 'center', dataIndex: 'countryCode', title: '国家', width: 120 },
          { dataIndex: 'browser', title: '浏览器', width: 120 },
          { dataIndex: 'os', title: '操作系统', width: 120 },
          { key: 'device', title: '设备', width: 120, render: ({ agent }) => agent?.device.vendor },
          { dataIndex: 'activityType', title: '类型', width: 120 },
          { dataIndex: 'createdAt', render: formatISOTime, title: '创建时间' },
          {
            align: 'right',
            key: 'detail',
            title: '详情',
            width: 80,
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
                      <DialogDescription>访客的详细信息</DialogDescription>
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
        dataSource={data?.visits}
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
              await toastPromise(rpc.dashboard.users.visits.delete({ ids: checked.map(item => item.id) }), {
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
        <DisplayByConditional condition={(data?.pagination.pageCount || 0) > 1}>
          <Pagination
            className="justify-end"
            limit={limit}
            onChange={payload => {
              setChecked([])
              setQuery(payload)
            }}
            {...data?.pagination}
          />
        </DisplayByConditional>
      </div>
    </div>
  )
}
