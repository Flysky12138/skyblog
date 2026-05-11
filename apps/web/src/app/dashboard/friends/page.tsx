'use client'

import { produce } from '@repo/react-hooks'
import { Card } from '@repo/ui/components-self/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@repo/ui/components/alert-dialog'
import { Button } from '@repo/ui/components/button'
import { ButtonLink } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

import { FriendCreateBodyType, FriendUpdateBodyType } from '@/app/api/[[...elysia]]/dashboard/friends/model'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

import { FriendEditModal } from './_components/friend-edit-modal'

export default function Page() {
  const { data: friends, mutate } = useSWR('0198eb99-caec-75cc-a4de-05dfa95cc14a', () => rpc.dashboard.friends.get().then(unwrap), {
    fallbackData: []
  })

  // 创建
  const handleCreate = React.useEffectEvent(async (body: FriendCreateBodyType) => {
    try {
      const data = await toastPromise(rpc.dashboard.friends.post(body).then(unwrap), {
        success: '保存成功'
      })
      await mutate(
        current => {
          return produce(current, draft => {
            draft?.push(data)
          })
        },
        {
          revalidate: false
        }
      )
    } catch (error) {
      console.error(error)
    }
  })

  // 删除
  const handleDelete = React.useEffectEvent(async (id: string, index: number) => {
    try {
      await toastPromise(rpc.dashboard.friends({ id }).delete(), {
        success: '删除成功'
      })
      await mutate(
        current => {
          return produce(current, draft => {
            draft?.splice(index, 1)
          })
        },
        {
          revalidate: false
        }
      )
    } catch (error) {
      console.error(error)
    }
  })

  // 更新
  const handleUpdate = React.useEffectEvent(async (id: string, body: FriendUpdateBodyType, index: number) => {
    try {
      const data = await toastPromise(rpc.dashboard.friends({ id }).put(body).then(unwrap), {
        success: '更新成功'
      })
      await mutate(
        current => {
          return produce(current, draft => {
            draft?.splice(index, 1, data)
          })
        },
        {
          revalidate: false
        }
      )
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
      {friends?.map((friend, index) => (
        <Card key={friend.id} className="group relative aspect-video select-none">
          <img
            alt={friend.name}
            className="absolute inset-0"
            decoding="async"
            height={900}
            loading="lazy"
            src={new URL(`/api/friends/${friend.id}/cover`, process.env.NEXT_PUBLIC_WEBSITE_URL).href}
            width={1600}
          />
          <div
            className={cn(
              'flex size-full items-center justify-center gap-3 backdrop-blur-xs dark:bg-black/75',
              'opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'
            )}
          >
            <p className="absolute bottom-1 left-2 text-lg opacity-75">{friend.name}</p>
            <ButtonLink href={friend.siteUrl} rel="noreferrer nofollow" size="icon" target="_blank" variant="outline">
              <EyeIcon />
            </ButtonLink>
            <FriendEditModal
              value={friend}
              onSubmit={async body => {
                await handleUpdate(friend.id, body, index)
              }}
            >
              <Button size="icon" variant="outline">
                <PencilIcon />
              </Button>
            </FriendEditModal>
            <AlertDialog>
              <AlertDialogTrigger render={<Button size="icon" variant="destructive" />}>
                <TrashIcon />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{friend.name}</AlertDialogTitle>
                  <AlertDialogDescription>此操作无法撤消，将永久删除该项</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    className="min-w-32"
                    onClick={() => {
                      void handleDelete(friend.id, index)
                    }}
                  >
                    确定
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      ))}

      <FriendEditModal onSubmit={handleCreate}>
        <Card
          className="aspect-video ring-0"
          render={
            <Button className="h-auto" variant="outline">
              <PlusIcon className="size-8" strokeWidth={3} />
            </Button>
          }
        />
      </FriendEditModal>
    </div>
  )
}
