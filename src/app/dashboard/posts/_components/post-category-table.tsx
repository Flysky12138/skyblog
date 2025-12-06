'use client'

import { produce } from 'immer'
import { Pencil } from 'lucide-react'
import useSWR from 'swr'

import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatISOTime } from '@/lib/parser/time'
import { toastPromise } from '@/lib/toast'

import { PostCategoryEditModal } from './post-category-edit-modal'

export const POST_CATEGORY_SWR_KEY = '019b689b-9dbf-71ea-aea6-c6b9768a71a2'

export function PostCategoryTable() {
  const {
    data: categories,
    isLoading,
    mutate
  } = useSWR(POST_CATEGORY_SWR_KEY, () => rpc.dashboard.posts.categories.get().then(unwrap), {
    fallbackData: []
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称', width: 120, widthFit: true },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        { dataIndex: 'createdAt', render: formatISOTime, title: '创建时间' },
        {
          align: 'right',
          key: 'edit',
          title: '操作',
          width: 100,
          render: (record, index) => (
            <div className="flex justify-end gap-2">
              <PostCategoryEditModal
                value={record}
                onSubmit={async body => {
                  const data = await toastPromise(rpc.dashboard.posts.categories({ id: record.id }).put(body).then(unwrap), {
                    success: '编辑成功'
                  })
                  await mutate(
                    produce<typeof categories>(draft => {
                      draft.splice(index, 1, data)
                    }),
                    {
                      revalidate: false
                    }
                  )
                }}
              >
                <TableActionButton>
                  <Pencil />
                </TableActionButton>
              </PostCategoryEditModal>
              <TableDeleteButton
                description="这将永久删除分类。"
                title={record.name}
                onConfirm={async () => {
                  await toastPromise(rpc.dashboard.posts.categories({ id: record.id }).delete(), {
                    success: '删除成功'
                  })
                  mutate(
                    produce<typeof categories>(draft => {
                      draft.splice(index, 1)
                    }),
                    {
                      revalidate: false
                    }
                  )
                }}
              />
            </div>
          )
        }
      ]}
      dataSource={categories}
      loading={isLoading}
    />
  )
}
