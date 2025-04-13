'use client'

import { Card } from '@/components/layout/card'
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
import { cn } from '@/lib/cn'
import { CustomRequest } from '@/lib/http/request'
import { Toast } from '@/lib/toast'
import { produce } from 'immer'
import { Eye, Pencil, Plus, Trash } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { FriendDetail } from './_components/friend-detail'

export default function Page() {
  const { data: friends, mutate: setFriends } = useSWR(
    '127b5c9e-fe2e-5d0a-90d1-89229101ee85',
    () => CustomRequest('GET api/dashboard/user/friends', {}),
    {
      fallbackData: []
    }
  )

  return (
    <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
      {friends?.map((friend, index) => (
        <Card key={friend.id} className="group relative aspect-video overflow-hidden select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={friend.name}
            className="absolute inset-0"
            height={900}
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
              <Link href={friend.url} rel="noreferrer nofollow" target="_blank">
                <Eye />
              </Link>
            </Button>
            <FriendDetail
              value={friend}
              onSubmit={async body => {
                const data = await Toast(CustomRequest('PUT api/dashboard/user/friends/[id]', { body, params: { id: friend.id } }), {
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
                      await Toast(CustomRequest('DELETE api/dashboard/user/friends/[id]', { params: { id: friend.id } }), {
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
          const data = await Toast(CustomRequest('POST api/dashboard/user/friends', { body }), {
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
    </section>
  )
}
