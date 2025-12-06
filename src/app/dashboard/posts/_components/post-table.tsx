'use client'

import { produce } from 'immer'
import { Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { PaginationQueryType } from '@/app/api/[[...elysia]]/model'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Pagination } from '@/components/pagination'
import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { Switch } from '@/components/ui/switch'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'
import { tw } from '@/lib/utils'

const limit = 20

export function PostTable() {
  const [query, setQuery] = useImmer<PaginationQueryType>({ limit, page: 1 })

  const { data, isLoading, mutate } = useSWR(['0198eb98-ec15-7335-a9d9-c34f3c3aa634', query], () => rpc.dashboard.posts.get({ query }).then(unwrap), {
    keepPreviousData: true
  })

  React.useEffect(() => {
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }, [data?.pagination.currentPage])

  return (
    <div className="space-y-4">
      <Table
        columns={[
          { key: 'index' },
          { dataIndex: 'title', title: '标题', width: 250 },
          { dataIndex: 'summary', title: '描述', width: 250, widthFit: true },
          { dataIndex: 'categories', title: '分类', width: 100, render: value => value.map(({ category }) => category.name).join('、') },
          { dataIndex: 'tags', title: '标签', width: 100, render: value => value.map(({ tag }) => tag.name).join('、') },
          { align: 'center', dataIndex: 'viewCount', title: '浏览量', width: 80 },
          {
            className: tw`leading-0`,
            dataIndex: 'isPublished',
            title: '公开',
            width: 60,
            render: (text, record, index) => (
              <Switch
                checked={text}
                onCheckedChange={async () => {
                  const post = await toastPromise(rpc.dashboard.posts({ id: record.id }).put({ isPublished: !text }).then(unwrap), {
                    success: '更新成功'
                  })
                  mutate(
                    produce<typeof data>(draft => {
                      draft?.posts.splice(index, 1, post)
                    }),
                    {
                      revalidate: false
                    }
                  )
                }}
              />
            )
          },
          {
            align: 'right',
            key: 'edit',
            title: '操作',
            width: 140,
            render: (record, index) => (
              <div className="flex justify-end gap-2">
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
                    await toastPromise(rpc.dashboard.posts({ id: record.id }).delete().then(unwrap), {
                      success: '删除成功'
                    })
                    mutate(
                      produce<typeof data>(draft => {
                        draft?.posts.splice(index, 1)
                      }),
                      {
                        revalidate: data?.posts.length == 1
                      }
                    )
                  }}
                />
              </div>
            )
          }
        ]}
        dataSource={data?.posts}
        loading={isLoading}
      />
      <DisplayByConditional condition={(data?.pagination.pageCount || 0) > 1}>
        <Pagination className="justify-end" limit={limit} onChange={setQuery} {...data?.pagination} />
      </DisplayByConditional>
    </div>
  )
}
