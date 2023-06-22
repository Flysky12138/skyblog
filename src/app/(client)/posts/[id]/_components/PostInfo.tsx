'use client'

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
  id: string
}

export default function PostInfo({ id }: PostInfoProps) {
  const {
    data: post,
    isLoading,
    error
  } = useSWR(`/api/post/info?id=${id}`, () => CustomRequest('GET api/post/info', { search: { id } }), {
    refreshInterval: 10 * 1000
  })

  const session = useSession()
  const [submitted, setSubmitted] = useSessionStorage(SESSIONSTORAGE.POST_VIEW_SUBMITTED(id), false)
  useTimeoutFn(async () => {
    if (!post?.published) return
    if (session.data?.role == 'ADMIN') return
    if (submitted) return
    await CustomRequest('POST api/post/view', { search: { id } })
    setSubmitted(true)
  }, 10 * 1000)

  if (isLoading) {
    return <span className="s-skeleton block h-[21px] w-60 rounded"></span>
  }

  return (
    <Typography className="break-all" level="body-sm">
      {error || !post ? (
        error.message
      ) : (
        <>
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
          。{post.published && `阅读 ${post.views} 次，0 条评论`}
        </>
      )}
    </Typography>
  )
}
