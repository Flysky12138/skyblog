'use client'

import { produce } from 'immer'
import { Eye, Pencil, Plus, Trash } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import useSWR from 'swr'

import { Card } from '@/components/static/card'
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { FriendEditModal } from './_components/friend-edit-modal'

export default function Page() {
  const { data: friends, mutate: setFriends } = useSWR('0198eb99-caec-75cc-a4de-05dfa95cc14a', () => rpc.dashboard.friends.get().then(unwrap), {
    fallbackData: []
  })

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
      {friends?.map((friend, index) => (
        <Card key={friend.id} className="group relative aspect-video overflow-hidden select-none">
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
            <Button asChild size="icon" variant="outline">
              <Link href={friend.siteUrl as Route} rel="noreferrer nofollow" target="_blank">
                <Eye />
              </Link>
            </Button>
            <FriendEditModal
              value={friend}
              onSubmit={async body => {
                const data = await toastPromise(rpc.dashboard.friends({ id: friend.id }).put(body).then(unwrap), {
                  success: '更新成功'
                })
                setFriends(
                  produce<typeof friends>(draft => {
                    draft.splice(index, 1, data)
                  })
                )
              }}
            >
              <Button size="icon" variant="outline">
                <Pencil />
              </Button>
            </FriendEditModal>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive">
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{friend.name}</AlertDialogTitle>
                  <AlertDialogDescription>此操作无法撤消，这将永久删除该项。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await toastPromise(rpc.dashboard.friends({ id: friend.id }).delete(), {
                        success: '删除成功'
                      })
                      setFriends(
                        produce<typeof friends>(draft => {
                          draft.splice(index, 1)
                        }),
                        {
                          revalidate: false
                        }
                      )
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
      <FriendEditModal
        onSubmit={async body => {
          const data = await toastPromise(rpc.dashboard.friends.post(body).then(unwrap), {
            success: '保存成功'
          })
          setFriends(
            produce<typeof friends>(draft => {
              draft.push(data)
            }),
            {
              revalidate: false
            }
          )
        }}
      >
        <Card className="flex aspect-video cursor-pointer items-center justify-center" tabIndex={0}>
          <Plus size={30} strokeWidth={3} />
        </Card>
      </FriendEditModal>
    </div>
  )
}
