'use client'

import { produce } from 'immer'
import { Pencil, Plus, Share2 } from 'lucide-react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'

import { Table, TableActionButton, TableDeleteButton } from '@/components/table'
import { Switch } from '@/components/ui/switch'
import { formatISOTime } from '@/lib/parser/time'
import { rpc, unwrap } from '@/lib/rpc'
import { toastPromise } from '@/lib/toast'
import { tw } from '@/lib/utils'

import { ClashEditModal } from './clash-edit-modal'

export function ClashTable() {
  const [{}, copy] = useCopyToClipboard()

  const {
    data: clashes,
    isLoading,
    mutate
  } = useSWR('0198eb98-3acc-70ab-82f3-14d5ca929785', () => rpc.dashboard.clashes.get().then(unwrap), {
    fallbackData: [],
    refreshInterval: 10 * 1000
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称', width: 180 },
        { dataIndex: 'description', title: '描述', width: 200, widthFit: true },
        { align: 'center', key: 'count', title: '次数', width: 80, render: record => record.activityLogs.length },
        {
          key: 'lastAt',
          title: '最近订阅时间',
          width: 180,
          render: record => (record.activityLogs.length ? formatISOTime(record.activityLogs[0].createdAt) : null)
        },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        {
          className: tw`leading-0`,
          dataIndex: 'isEnabled',
          title: '启用',
          width: 60,
          render: (text, { id }, index) => (
            <Switch
              checked={text}
              onCheckedChange={async () => {
                const clash = await toastPromise(rpc.dashboard.clashes({ id }).put({ isEnabled: !text }).then(unwrap), {
                  success: '更新成功'
                })
                mutate(
                  produce<typeof clashes>(draft => {
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
          key: 'action',
          width: 140,
          render: (record, index) => (
            <div className="flex justify-end gap-2">
              <TableActionButton
                tooltip="复制"
                onClick={() => {
                  copy(new URL(`/api/clashes/${record.id}`, window.origin).href)
                  toast.success('复制成功')
                }}
              >
                <Share2 />
              </TableActionButton>
              <ClashEditModal
                value={record}
                onSubmit={async body => {
                  const data = await toastPromise(rpc.dashboard.clashes({ id: record.id }).put(body).then(unwrap), {
                    success: '修改成功'
                  })
                  mutate(
                    produce<typeof clashes>(draft => {
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
              </ClashEditModal>
              <TableDeleteButton
                description="将永久删除该项。"
                title={record.name}
                onConfirm={async () => {
                  await toastPromise(rpc.dashboard.clashes({ id: record.id }).delete(), {
                    success: '删除成功'
                  })
                  mutate(
                    produce<typeof clashes>(draft => {
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
            <ClashEditModal
              onSubmit={async body => {
                const data = await toastPromise(rpc.dashboard.clashes.post(body).then(unwrap), {
                  success: '添加成功'
                })
                mutate(
                  produce<typeof clashes>(draft => {
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
            </ClashEditModal>
          )
        }
      ]}
      dataSource={clashes}
      loading={isLoading}
    />
  )
}
