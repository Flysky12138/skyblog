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
import { toastPromise } from '@/lib/toast'
import { tw } from '@/lib/utils'

import { ClashDetail } from './clash-detail'

export const ClashTable = () => {
  const [{}, copy] = useCopyToClipboard()

  const {
    data: clashs,
    isLoading,
    mutate
  } = useSWR('0198eb98-3acc-70ab-82f3-14d5ca929785', () => CustomRequest('GET /api/dashboard/clash', {}), {
    fallbackData: [],
    refreshInterval: 10 * 1000
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称' },
        { dataIndex: 'description', title: '描述' },
        { align: 'center', headerClassName: tw`w-20`, key: 'count', title: '次数', render: record => record.activityLogs.length },
        {
          key: 'lastAt',
          title: '最近订阅时间',
          render: record => (record.activityLogs.length ? formatISOTime(record.activityLogs[0].createdAt) : null)
        },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        {
          dataIndex: 'isEnabled',
          headerClassName: tw`w-12`,
          title: '启用',
          render: (text, { id }, index) => (
            <Switch
              checked={text}
              onCheckedChange={async () => {
                const clash = await toastPromise(
                  CustomRequest('PATCH /api/dashboard/clash', {
                    body: { isEnabled: !text },
                    search: { id }
                  }),
                  {
                    success: '更新成功'
                  }
                )
                mutate(
                  produce<typeof clashs>(draft => {
                    draft.splice(index, 1, clash)
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
          headerClassName: tw`w-36`,
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
                value={{
                  ...record,
                  variables: record.variables || {}
                }}
                onSubmit={async ({ content, description, name, templateId, variables }) => {
                  const data = await toastPromise(
                    CustomRequest('PUT /api/dashboard/clash', {
                      body: { content, description, name, templateId, variables },
                      search: { id: record.id }
                    }),
                    {
                      success: '修改成功'
                    }
                  )
                  mutate(
                    produce<typeof clashs>(draft => {
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
              </ClashDetail>
              <TableDeleteButton
                description="将永久删除该项。"
                title={record.name}
                onConfirm={async () => {
                  await toastPromise(CustomRequest('DELETE /api/dashboard/clash', { search: { id: record.id } }), {
                    success: '删除成功'
                  })
                  mutate(
                    produce<typeof clashs>(draft => {
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
            <ClashDetail
              onSubmit={async body => {
                const data = await toastPromise(CustomRequest('POST /api/dashboard/clash', { body }), {
                  success: '添加成功'
                })
                mutate(
                  produce<typeof clashs>(draft => {
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
            </ClashDetail>
          )
        }
      ]}
      dataSource={clashs}
      loading={isLoading}
    />
  )
}
