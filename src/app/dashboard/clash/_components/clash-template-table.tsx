'use client'

import { produce } from 'immer'
import { Pencil, Plus } from 'lucide-react'
import useSWR from 'swr'

import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { CustomRequest } from '@/lib/http/request'
import { formatISOTime } from '@/lib/parser/time'
import { Toast } from '@/lib/toast'

import { ClashTemplateDetail } from './clash-template-detail'

export const SWR_KEY_CLASH_TEMPLATES = '0198eb97-f705-777e-a134-9073d575c7b5'

export const ClashTemplateTable = () => {
  const { data, isLoading, mutate } = useSWR(SWR_KEY_CLASH_TEMPLATES, () => CustomRequest('GET /api/dashboard/clash/template', {}), {
    fallbackData: []
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称' },
        { dataIndex: '_count', title: '引用', render: text => text.clashs },
        { dataIndex: 'createdAt', headerClassName: 'w-48', render: formatISOTime, title: '创建时间' },
        { dataIndex: 'updatedAt', headerClassName: 'w-48', render: formatISOTime, title: '更新时间' },
        {
          align: 'right',
          headerClassName: 'w-24',
          key: 'action',
          render: (record, index) => (
            <div className="flex justify-end gap-2">
              <ClashTemplateDetail
                value={record}
                onSubmit={async ({ content, name }) => {
                  const data = await Toast(
                    CustomRequest('PUT /api/dashboard/clash/template', { body: { content, name }, search: { id: record.id } }),
                    {
                      success: '修改成功'
                    }
                  )
                  mutate(
                    produce(state => {
                      state.splice(index, 1, data)
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
                  await Toast(CustomRequest('DELETE /api/dashboard/clash/template', { search: { id: record.id } }), {
                    success: '删除成功'
                  })
                  mutate(
                    produce(state => {
                      state.splice(index, 1)
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
                const data = await Toast(CustomRequest('POST /api/dashboard/clash/template', { body }), {
                  success: '添加成功'
                })
                mutate(
                  produce(state => {
                    state.unshift(data)
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
      dataSource={data}
      loading={isLoading}
    />
  )
}
