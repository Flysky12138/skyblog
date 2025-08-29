'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { useSessionStorage, useTimeoutFn } from 'react-use'
import useSWR from 'swr'

import { GET } from '@/app/api/post/info/route'
import { Skeleton } from '@/components/ui/skeleton'
import { SESSIONSTORAGE } from '@/lib/constants'
import { CustomRequest } from '@/lib/http/request'
import { formatISOTime2 } from '@/lib/parser/time'

interface PostInfoProps {
  defaultValue: GET['return']
  id: string
}

export const PostInfo = ({ defaultValue, id }: PostInfoProps) => {
  const { data: post, isLoading } = useSWR(
    ['0198eb97-be8c-705d-9037-48eb6a95c13a', id],
    () => CustomRequest('GET /api/post/info', { search: { id } }),
    {
      fallbackData: defaultValue,
      refreshInterval: 20 * 1000
    }
  )

  const session = useSession()
  const [viewed, setViewed] = useSessionStorage(SESSIONSTORAGE.POST_VIEW_SUBMITTED(id), false)
  useTimeoutFn(async () => {
    if (!post?.published) return
    if (session.data?.role == 'ADMIN') return
    if (viewed) return
    await CustomRequest('POST /api/post/view', { search: { id } })
    setViewed(true)
  }, 5 * 1000)

  if (!post) {
    return <Skeleton className="h-5.25 w-60" />
  }

  return (
    <p className="text-subtitle-foreground text-sm break-all">
      这篇文章发布于 {formatISOTime2(post.createdAt)}
      {post.categories.length > 0 ? (
        <>
          ，归类于&nbsp;
          {post.categories.map((category, index) => (
            <React.Fragment key={category.id}>
              <Link className="text-link-foreground" href={`/posts/search?categories=${category.name}`}>
                {category.name}
              </Link>
              {index < post.categories.length - 1 ? '、' : null}
            </React.Fragment>
          ))}
        </>
      ) : null}
      。{post.published && `阅读 ${isLoading ? '?' : post.views} 次，0 条评论`}
    </p>
  )
}
