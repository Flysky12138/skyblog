'use client'

import { GET } from '@/app/api/post/info/route'
import { SESSIONSTORAGE } from '@/lib/constants'
import { formatISOTime2 } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Typography } from '@mui/joy'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { useSessionStorage, useTimeoutFn } from 'react-use'
import useSWR from 'swr'

interface PostInfoProps {
  defaultValue: GET['return']
  id: string
}

export default function PostInfo({ id, defaultValue }: PostInfoProps) {
  const { data: post, isLoading } = useSWR(`/api/post/info?id=${id}`, () => CustomRequest('GET api/post/info', { search: { id } }), {
    fallbackData: defaultValue,
    refreshInterval: 20 * 1000
  })

  const session = useSession()
  const [viewed, setViewed] = useSessionStorage(SESSIONSTORAGE.POST_VIEW_SUBMITTED(id), false)
  useTimeoutFn(async () => {
    if (!post?.published) return
    if (session.data?.role == 'ADMIN') return
    if (viewed) return
    await CustomRequest('POST api/post/view', { search: { id } })
    setViewed(true)
  }, 5 * 1000)

  if (!post) {
    return <span className="s-skeleton block h-[21px] w-60 rounded"></span>
  }

  return (
    <Typography className="break-all" level="body-sm">
      这篇文章发布于 {formatISOTime2(post.createdAt)}
      {post.categories.length > 0 ? (
        <>
          ，归类于&nbsp;
          {post.categories.map((category, index) => (
            <React.Fragment key={category.id}>
              <Link className="text-sky-500 hover:s-underline" href={`/categories/${category.name}/1`}>
                {category.name}
              </Link>
              {index < post.categories.length - 1 ? '、' : null}
            </React.Fragment>
          ))}
        </>
      ) : null}
      。{post.published && `阅读 ${isLoading ? '?' : post.views} 次，0 条评论`}
    </Typography>
  )
}
