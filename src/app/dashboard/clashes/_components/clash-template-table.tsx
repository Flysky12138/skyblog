'use client'

import { produce } from 'immer'
import { Pencil, Plus } from 'lucide-react'
import useSWR from 'swr'

import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatISOTime } from '@/lib/parser/time'
import { toastPromise } from '@/lib/toast'

import { ClashTemplateEditModal } from './clash-template-edit-modal'

export const SWR_KEY_CLASH_TEMPLATES = '0198eb97-f705-777e-a134-9073d575c7b5'

export function ClashTemplateTable() {
  const {
    data: clashTemplates,
    isLoading,
    mutate
  } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => rpc.dashboard.clashes.templates.get().then(unwrap), {
    fallbackData: []
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称', width: 180, widthFit: true },
        { align: 'center', dataIndex: '_count', title: '被使用', width: 100, render: text => text.clashes },
        { dataIndex: 'createdAt', render: formatISOTime, title: '创建时间' },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        {
          align: 'right',
          key: 'action',
          width: 100,
          render: (record, index) => (
            <div className="flex justify-end gap-2">
              <ClashTemplateEditModal
                value={record}
                onSubmit={async body => {
                  const data = await toastPromise(rpc.dashboard.clashes.templates({ id: record.id }).put(body).then(unwrap), {
                    success: '修改成功'
                  })
                  mutate(
                    produce<typeof clashTemplates>(draft => {
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
              </ClashTemplateEditModal>
              <TableDeleteButton
                description="将永久删除该项。"
                title={record.name}
                onConfirm={async () => {
                  await toastPromise(rpc.dashboard.clashes.templates({ id: record.id }).delete(), {
                    success: '删除成功'
                  })
                  mutate(
                    produce<typeof clashTemplates>(draft => {
                      draft.splice(index, 1)
                    }),
                    {
                      revalidate: false
                    }
                  )
                }}
              />
            </div>
          ),
          title: () => (
            <ClashTemplateEditModal
              onSubmit={async body => {
                const data = await toastPromise(rpc.dashboard.clashes.templates.post(body).then(unwrap), {
                  success: '添加成功'
                })
                mutate(
                  produce<typeof clashTemplates>(draft => {
                    draft.unshift(data)
                  }),
                  {
                    revalidate: false
                  }
                )
              }}
            >
              <TableActionButton>
                <Plus />
              </TableActionButton>
            </ClashTemplateEditModal>
          )
        }
      ]}
      dataSource={clashTemplates}
      loading={isLoading}
    />
  )
}
