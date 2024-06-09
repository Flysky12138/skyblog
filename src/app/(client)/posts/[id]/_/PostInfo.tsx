'use client'

import { PostInfoGetResponseType } from '@/app/api/post/info/route'
import { SESSIONSTORAGE } from '@/lib/constants'
import { formatISOTime2 } from '@/lib/parser/time'
import { CustomFetch } from '@/lib/server/fetch'
import { Typography } from '@mui/joy'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { useSessionStorage, useTimeoutFn } from 'react-use'
import useSWR from 'swr'

const getPostInfo = async (id: string) => {
  return await CustomFetch<PostInfoGetResponseType>(`/api/post/info?id=${id}`)
}
const postPostView = async (id: string) => {
  return await CustomFetch<PostInfoGetResponseType>(`/api/post/view?id=${id}`, {
    method: 'POST'
  })
}

interface PostInfoProps {
  id: string
}

export default function PostInfo({ id }: PostInfoProps) {
  const { data: post, isLoading } = useSWR(`/api/post/info?id=${id}`, () => getPostInfo(id), {
    refreshInterval: 10 * 1000
  })

  const session = useSession()
  const [submitted, setSubmitted] = useSessionStorage(SESSIONSTORAGE.POST_VIEW_SUBMITTED(id), false)
  useTimeoutFn(async () => {
    if (!post?.published) return
    if (session.data?.role == 'ADMIN') return
    if (submitted) return
    await postPostView(id)
    setSubmitted(true)
  }, 10 * 1000)

  if (isLoading) {
    return <span className="s-skeleton block h-[21px] w-60 rounded"></span>
  }

  if (!post) return null

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
      。{post.published && `阅读 ${post.views} 次，0 条评论`}
    </Typography>
  )
}
