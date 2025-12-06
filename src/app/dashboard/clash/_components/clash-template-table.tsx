'use client'

import { produce } from 'immer'
import { Pencil, Plus } from 'lucide-react'
import useSWR from 'swr'

import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { CustomRequest } from '@/lib/http/request'
import { formatISOTime } from '@/lib/parser/time'
import { toastPromise } from '@/lib/toast'
import { tw } from '@/lib/utils'

import { ClashTemplateDetail } from './clash-template-detail'

export const SWR_KEY_CLASH_TEMPLATES = '0198eb97-f705-777e-a134-9073d575c7b5'

export const ClashTemplateTable = () => {
  const {
    data: clashTemplates,
    isLoading,
    mutate
  } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => CustomRequest('GET /api/dashboard/clash/template', {}), {
    fallbackData: []
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称' },
        { align: 'center', dataIndex: '_count', headerClassName: tw`w-20`, title: '被使用', render: text => text.clashes },
        { dataIndex: 'createdAt', headerClassName: tw`w-48`, render: formatISOTime, title: '创建时间' },
        { dataIndex: 'updatedAt', headerClassName: tw`w-48`, render: formatISOTime, title: '更新时间' },
        {
          align: 'right',
          headerClassName: tw`w-24`,
          key: 'action',
          render: (record, index) => (
            <div className="flex justify-end gap-2">
              <ClashTemplateDetail
                value={record}
                onSubmit={async ({ content, name }) => {
                  const data = await toastPromise(
                    CustomRequest('PUT /api/dashboard/clash/template', { body: { content, name }, search: { id: record.id } }),
                    {
                      success: '修改成功'
                    }
                  )
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
              </ClashTemplateDetail>
              <TableDeleteButton
                description="将永久删除该项。"
                title={record.name}
                onConfirm={async () => {
                  await toastPromise(CustomRequest('DELETE /api/dashboard/clash/template', { search: { id: record.id } }), {
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
            <ClashTemplateDetail
              onSubmit={async body => {
                const data = await toastPromise(CustomRequest('POST /api/dashboard/clash/template', { body }), {
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
            </ClashTemplateDetail>
          )
        }
      ]}
      dataSource={clashTemplates}
      loading={isLoading}
    />
  )
}
