'use client'

import Card from '@/components/layout/Card'
import ModalDelete from '@/components/modal/ModalDelete'
import { cn } from '@/lib/cn'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Add, Delete, Edit, Sync } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import { produce } from 'immer'
import Image from 'next/image'
import useSWR from 'swr'
import ModalForm from './_components/ModalForm'

export default function Page() {
  const { data: friendlinks, mutate: setFriendlinks } = useSWR('/api/dashboard/friend-links', () => CustomRequest('GET api/dashboard/friend-links', {}))

  return (
    <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
      {friendlinks?.map((friendlink, index) => (
        <Card key={friendlink.id} className="group relative aspect-video select-none overflow-clip">
          {friendlink.cover && <Image alt={friendlink.name} className="absolute inset-0" height={900} src={friendlink.cover} width={1600} />}
          <div
            className={cn(
              'absolute inset-y-0 right-0',
              'flex flex-col justify-center gap-y-3',
              'rounded-l-lg p-2',
              'bg-white dark:bg-zinc-900',
              'translate-x-full transition-transform group-focus-within:translate-x-0 group-hover:translate-x-0'
            )}
          >
            <ModalForm
              component={props => (
                <Tooltip placement="left" title="编辑">
                  <IconButton {...props}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
              value={friendlink}
              onSubmit={async body => {
                const data = await Toast(CustomRequest('PUT api/dashboard/friend-links/[id]', { body, params: { id: String(friendlink.id) } }), {
                  success: '更新成功'
                })
                setFriendlinks(
                  produce(state => {
                    state.splice(index, 1, data)
                  })
                )
              }}
            />
            <Tooltip placement="left" title="刷新">
              <IconButton
                color="warning"
                onClick={async () => {
                  const data = await Toast(CustomRequest('PATCH api/dashboard/friend-links/[id]', { params: { id: String(friendlink.id) } }), {
                    success: '获取封面成功'
                  })
                  setFriendlinks(
                    produce(state => {
                      state.splice(index, 1, data)
                    })
                  )
                }}
              >
                <Sync />
              </IconButton>
            </Tooltip>
            <ModalDelete
              component={props => (
                <Tooltip placement="left" title="删除">
                  <IconButton color="danger" {...props}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
              description={friendlink.name}
              onSubmit={async () => {
                await CustomRequest('DELETE api/dashboard/friend-links/[id]', { params: { id: String(friendlink.id) } })
                setFriendlinks(
                  produce(state => {
                    state.splice(index, 1)
                  })
                )
              }}
            />
          </div>
        </Card>
      ))}
      <ModalForm
        component={props => (
          <Card className="flex aspect-video items-center justify-center" tabIndex={0} {...props}>
            <Add fontSize="large" />
          </Card>
        )}
        onSubmit={async body => {
          const data = await Toast(CustomRequest('POST api/dashboard/friend-links', { body }), {
            success: '保存成功'
          })
          setFriendlinks(
            produce(state => {
              state.push(data)
            })
          )
        }}
      />
    </section>
  )
}
