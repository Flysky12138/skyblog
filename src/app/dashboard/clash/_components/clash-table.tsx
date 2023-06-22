'use client'

import { produce } from 'immer'
import { Pencil, Plus, Share2 } from 'lucide-react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'

import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { Switch } from '@/components/ui/switch'
import { CustomRequest } from '@/lib/http/request'
import { formatISOTime } from '@/lib/parser/time'
import { Toast } from '@/lib/toast'

import { ClashDetail } from './clash-detail'

export const ClashTable = () => {
  const [{}, copy] = useCopyToClipboard()

  const { data, isLoading, mutate } = useSWR('0198eb98-3acc-70ab-82f3-14d5ca929785', () => CustomRequest('GET /api/dashboard/clash', {}), {
    fallbackData: [],
    refreshInterval: 10 * 1000
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称' },
        { dataIndex: 'subtitle', title: '描述' },
        { dataIndex: 'visitorInfos', title: '次数', render: text => text.length },
        { dataIndex: 'subscribeLastAt', title: '最近订阅时间', render: text => (text ? formatISOTime(text) : null) },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        {
          dataIndex: 'enabled',
          headerClassName: 'w-12',
          title: '启用',
          render: (text, { id }, index) => (
            <Switch
              checked={text}
              onCheckedChange={async () => {
                const data = await Toast(
                  CustomRequest('PATCH /api/dashboard/clash', {
                    body: { enabled: !text },
                    search: { id }
                  }),
                  {
                    success: '更新成功'
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
            />
          )
        },
        {
          align: 'right',
          headerClassName: 'w-36',
          key: 'action',
          render: (record, index) => (
            <div className="flex justify-end gap-2">
              <TableActionButton
                tooltip="复制"
                onClick={() => {
                  copy(new URL(`/api/clash/${record.id}`, window.origin).href)
                  toast.success('复制成功')
                }}
              >
                <Share2 />
              </TableActionButton>
              <ClashDetail
                value={record}
                onSubmit={async ({ clashTemplateId, content, name, subtitle, variables }) => {
                  const data = await Toast(
                    CustomRequest('PUT /api/dashboard/clash', {
                      body: { clashTemplateId, content, name, subtitle, variables },
                      search: { id: record.id }
                    }),
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
              </ClashDetail>
              <TableDeleteButton
                description="将永久删除该项。"
                title={record.name}
                onConfirm={async () => {
                  await Toast(CustomRequest('DELETE /api/dashboard/clash', { search: { id: record.id } }), {
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
            <ClashDetail
              onSubmit={async body => {
                const data = await Toast(CustomRequest('POST /api/dashboard/clash', { body }), {
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
            </ClashDetail>
          )
        }
      ]}
      dataSource={data}
      loading={isLoading}
    />
  )
}
