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
} from '@/components/ui-overwrite/alert-dialog'
import { Button } from '@/components/ui/button'
import { CustomRequest } from '@/lib/http/request'
import { Toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { FriendDetail } from './_components/friend-detail'

export default function Page() {
  const { data: friends, mutate: setFriends } = useSWR(
    '0198eb99-caec-75cc-a4de-05dfa95cc14a',
    () => CustomRequest('GET /api/dashboard/user/friends', {}),
    {
      fallbackData: []
    }
  )

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
              <Link href={friend.url as Route} rel="noreferrer nofollow" target="_blank">
                <Eye />
              </Link>
            </Button>
            <FriendDetail
              value={friend}
              onSubmit={async body => {
                const data = await Toast(CustomRequest('PUT /api/dashboard/user/friends/[id]', { body, params: { id: friend.id } }), {
                  success: '更新成功'
                })
                setFriends(
                  produce(state => {
                    state.splice(index, 1, data)
                  })
                )
              }}
            >
              <Button size="icon" variant="outline">
                <Pencil />
              </Button>
            </FriendDetail>
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
                      await Toast(CustomRequest('DELETE /api/dashboard/user/friends/[id]', { params: { id: friend.id } }), {
                        success: '删除成功'
                      })
                      setFriends(
                        produce(state => {
                          state.splice(index, 1)
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
      <FriendDetail
        onSubmit={async body => {
          const data = await Toast(CustomRequest('POST /api/dashboard/user/friends', { body }), {
            success: '保存成功'
          })
          setFriends(
            produce(state => {
              state.push(data)
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
      </FriendDetail>
    </div>
  )
}
