'use client'

import { produce } from 'immer'
import { Pencil } from 'lucide-react'
import useSWR from 'swr'

import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatISOTime } from '@/lib/parser/time'
import { toastPromise } from '@/lib/toast'

import { PostTagEditModal } from './post-tag-edit-modal'

export const POST_TAG_SWR_KEY = '019b68a8-c2e3-75fa-8119-2a99c344a556'

export function PostTagTable() {
  const {
    data: tags,
    isLoading,
    mutate
  } = useSWR(POST_TAG_SWR_KEY, () => rpc.dashboard.posts.tags.get().then(unwrap), {
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
              <PostTagEditModal
                value={record}
                onSubmit={async body => {
                  const data = await toastPromise(rpc.dashboard.posts.tags({ id: record.id }).put(body).then(unwrap), {
                    success: '编辑成功'
                  })
                  await mutate(
                    produce<typeof tags>(draft => {
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
              </PostTagEditModal>
              <TableDeleteButton
                description="这将永久删除标签。"
                title={record.name}
                onConfirm={async () => {
                  await toastPromise(rpc.dashboard.posts({ id: record.id }).delete(), {
                    success: '删除成功'
                  })
                  mutate(
                    produce<typeof tags>(draft => {
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
      dataSource={tags}
      loading={isLoading}
    />
  )
}
