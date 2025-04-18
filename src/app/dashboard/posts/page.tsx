'use client'

import { GET } from '@/app/api/dashboard/posts/route'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Pagination } from '@/components/pagination'
import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { Switch } from '@/components/ui/switch'
import { CustomRequest } from '@/lib/http/request'
import { Toast } from '@/lib/toast'
import { produce } from 'immer'
import { Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

export default function Page() {
  const [search, setSearch] = useImmer<GET['search']>({ limit: 20, page: 1 })

  const { data, isLoading, mutate } = useSWR(['6a75f4b6-326d-5aa8-b53c-e5af8d86dec2', search], () => {
    return CustomRequest('GET api/dashboard/posts', { search })
  })

  return (
    <section className="space-y-4">
      <Table
        columns={[
          { key: 'index' },
          { dataIndex: 'title', title: '标题' },
          { dataIndex: 'description', title: '描述' },
          { dataIndex: 'categories', render: value => value.map(category => category.name).join('、'), title: '分类' },
          { dataIndex: 'tags', render: value => value.map(category => category.name).join('、'), title: '标签' },
          {
            dataIndex: 'published',
            headerClassName: 'w-12',
            render: (text, record, index) => (
              <Switch
                checked={text}
                onCheckedChange={async () => {
                  const data = await Toast(
                    CustomRequest('PATCH api/dashboard/posts/[id]', {
                      body: { published: !text },
                      params: { id: record.id }
                    }),
                    {
                      success: '更新成功'
                    }
                  )
                  mutate(
                    produce(state => {
                      state.result.splice(index, 1, data)
                    }),
                    {
                      revalidate: false
                    }
                  )
                }}
              />
            ),
            title: '公开'
          },
          {
            align: 'right',
            headerClassName: 'w-36',
            key: 'edit',
            render: (record, index) => (
              <div key={index} className="flex justify-end gap-2">
                <TableActionButton asChild>
                  <Link className="cursor-pointer" href={`/posts/${record.id}`} target="_blank">
                    <Eye />
                  </Link>
                </TableActionButton>
                <TableActionButton asChild>
                  <Link className="cursor-pointer" href={`/dashboard/posts/${record.id}`}>
                    <Pencil />
                  </Link>
                </TableActionButton>
                <TableDeleteButton
                  description="这将永久删除文章。"
                  title={record.title}
                  onConfirm={async () => {
                    await Toast(CustomRequest('DELETE api/dashboard/posts/[id]', { params: { id: record.id } }), {
                      success: '删除成功'
                    })
                    mutate(
                      produce(state => {
                        state.result.splice(index, 1)
                      }),
                      {
                        revalidate: data!.result.length == 1
                      }
                    )
                  }}
                />
              </div>
            ),
            title: '操作'
          }
        ]}
        dataSource={data?.result}
        loading={isLoading}
      />
      <DisplayByConditional condition={(data?.totalPages || 0) > 1}>
        <Pagination className="justify-end" onChange={setSearch} {...data} />
      </DisplayByConditional>
    </section>
  )
}
