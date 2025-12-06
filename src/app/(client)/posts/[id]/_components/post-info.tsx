'use client'

import { Treaty } from '@elysiajs/eden'
import { produce } from 'immer'
import Link from 'next/link'
import React from 'react'
import { useSessionStorage } from 'react-use'
import useSWR from 'swr'

import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth/client'
import { SESSIONSTORAGE_KEY } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { formatISOTime2 } from '@/lib/parser/time'

interface PostInfoProps {
  defaultValue: Treaty.Data<ReturnType<typeof rpc.posts>['get']>
  id: string
}

export function PostInfo({ defaultValue, id }: PostInfoProps) {
  const {
    data: post,
    isLoading,
    mutate
  } = useSWR(['0198eb97-be8c-705d-9037-48eb6a95c13a', id], () => rpc.posts({ id }).get().then(unwrap), {
    fallbackData: defaultValue,
    refreshInterval: 20 * 1000
  })

  // 增加访问量
  const { data: session, isPending } = authClient.useSession()
  const [viewed, setViewed] = useSessionStorage(SESSIONSTORAGE_KEY.POST_VIEW_SUBMITTED(id), false)
  React.useEffect(() => {
    if (viewed) return
    if (!post?.isPublished) return
    if (isPending) return
    if (session?.user.role == 'admin') return

    const timer = setTimeout(async () => {
      const { viewCount } = await rpc.posts({ id }).patch().then(unwrap)
      await mutate(
        produce<PostInfoProps['defaultValue']>(draft => {
          draft!.viewCount = viewCount
        }),
        {
          revalidate: false
        }
      )
      setViewed(true)
    }, 5 * 1000)

    return () => clearTimeout(timer)
  }, [session?.user.role, id, isPending, mutate, post?.isPublished, setViewed, viewed])

  if (!post) return <Skeleton className="h-5.25 w-60" />

  return (
    <p className="text-muted-foreground text-sm break-all">
      这篇文章发布于 {formatISOTime2(post.createdAt)}
      {post.categories.length > 0 ? (
        <>
          ，归类于&nbsp;
          {post.categories.map(({ category }, index) => (
            <React.Fragment key={category.id}>
              <Link
                className="text-link-foreground"
                href={{
                  pathname: '/',
                  query: {
                    categories: category.name
                  }
                }}
              >
                {category.name}
              </Link>
              {index < post.categories.length - 1 ? '、' : null}
            </React.Fragment>
          ))}
        </>
      ) : null}
      。{post.isPublished && `阅读 ${isLoading ? '?' : post.viewCount} 次，${isLoading ? '?' : post.commentCount} 条评论`}
    </p>
  )
}
