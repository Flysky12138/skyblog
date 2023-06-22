'use client'

import { GET } from '@/app/api/dashboard/friend-links/route'
import Card from '@/components/layout/Card'
import ModalDelete from '@/components/modal/ModalDelete'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Add, Delete, Edit, Sync } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import Image from 'next/image'
import { useAsync } from 'react-use'
import { useImmer } from 'use-immer'
import ModalForm from './_components/ModalForm'

export default function Page() {
  const [friendlinks, setFriendlinks] = useImmer<GET['return']>([])
  useAsync(() => CustomRequest('GET api/dashboard/friend-links', {}).then(setFriendlinks))

  return (
    <>
      {friendlinks.map((friendlink, index) => (
        <Card key={friendlink.id} className="group relative aspect-video select-none overflow-clip">
          {friendlink.cover && <Image alt={friendlink.name} className="absolute inset-0" height={900} src={friendlink.cover} width={1600} />}
          <div className="absolute inset-y-0 right-0 flex translate-x-full flex-col justify-center gap-y-3 rounded-l-lg bg-white p-2 transition-transform group-focus-within:translate-x-0 group-hover:translate-x-0 dark:bg-zinc-900">
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
                const data = await Toast(
                  CustomRequest('PUT api/dashboard/friend-links/[id]', {
                    body,
                    params: { id: String(friendlink.id) }
                  }),
                  '更新成功'
                )
                setFriendlinks(state => {
                  state.splice(index, 1, data)
                })
              }}
            />
            <Tooltip placement="left" title="刷新">
              <IconButton
                color="warning"
                onClick={async () => {
                  const data = await Toast(
                    CustomRequest('PATCH api/dashboard/friend-links/[id]', {
                      params: { id: String(friendlink.id) }
                    }),
                    '获取封面成功'
                  )
                  setFriendlinks(state => {
                    state.splice(index, 1, data)
                  })
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
              title={`删除《${friendlink.name}》？`}
              onSubmit={async () => {
                CustomRequest('DELETE api/dashboard/friend-links/[id]', {
                  params: { id: String(friendlink.id) }
                })
                setFriendlinks(state => {
                  state.splice(index, 1)
                })
              }}
            />
          </div>
        </Card>
      ))}
      <ModalForm
        component={props => (
          <Card className="flex aspect-video cursor-pointer items-center justify-center" tabIndex={0} {...props}>
            <Add fontSize="large" />
          </Card>
        )}
        onSubmit={async body => {
          const data = await Toast(CustomRequest('POST api/dashboard/friend-links', { body }), '保存成功')
          setFriendlinks(state => {
            state.push(data)
          })
        }}
      />
    </>
  )
}
