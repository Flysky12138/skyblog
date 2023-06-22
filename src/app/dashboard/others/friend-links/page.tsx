'use client'

import { FriendLinksGetResponseType, FriendLinksPostRequest, FriendLinksPostResponseType } from '@/app/api/dashboard/friend-links/route'
import Card from '@/components/layout/Card'
import ModalDelete from '@/components/modal/ModalDelete'
import { CustomFetch } from '@/lib/server/fetch'
import { Toast } from '@/lib/toast'
import { Add, Delete, Edit, Sync } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import Image from 'next/image'
import { useAsync } from 'react-use'
import { useImmer } from 'use-immer'
import ModalForm from './_/ModalForm'

const getFriendLinks = async () => {
  return await CustomFetch<FriendLinksGetResponseType>('/api/dashboard/friend-links')
}
const postFriendLinks = async (payload: FriendLinksPostRequest) => {
  return await CustomFetch<FriendLinksPostResponseType>('/api/dashboard/friend-links', {
    body: payload,
    method: 'POST'
  })
}
const putFriendLinks = async (id: number, payload: FriendLinksPostRequest) => {
  return await CustomFetch<FriendLinksPostResponseType>(`/api/dashboard/friend-links/${id}`, {
    body: payload,
    method: 'PUT'
  })
}
const patchFriendLinks = async (id: number) => {
  return await CustomFetch<FriendLinksPostResponseType>(`/api/dashboard/friend-links/${id}`, {
    method: 'PATCH'
  })
}
const deleteFriendLinks = async (id: number) => {
  return await CustomFetch<FriendLinksPostResponseType>(`/api/dashboard/friend-links/${id}`, {
    method: 'DELETE'
  })
}

export default function Page() {
  const [friendlinks, setFriendlinks] = useImmer<FriendLinksGetResponseType>([])
  useAsync(() => getFriendLinks().then(setFriendlinks))

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
              onSubmit={async payload => {
                const data = await Toast(putFriendLinks(friendlink.id, payload), '更新成功')
                setFriendlinks(state => {
                  state.splice(index, 1, data)
                })
              }}
            />
            <Tooltip placement="left" title="刷新">
              <IconButton
                color="warning"
                onClick={async () => {
                  const data = await Toast(patchFriendLinks(friendlink.id), '获取封面成功')
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
                deleteFriendLinks(friendlink.id)
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
        onSubmit={async payload => {
          const data = await Toast(postFriendLinks(payload), '保存成功')
          setFriendlinks(state => {
            state.push(data)
          })
        }}
      />
    </>
  )
}
