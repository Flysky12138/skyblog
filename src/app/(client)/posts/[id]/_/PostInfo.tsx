'use client'

import { PostInfoGetResponseType } from '@/app/api/post/info/route'
import { SESSIONSTORAGE } from '@/lib/keys'
import { formatISOTime2 } from '@/lib/parser/time'
import { CustomFetch } from '@/lib/server/fetch'
import { Typography } from '@mui/joy'
import Link from 'next/link'
import React from 'react'
import { useTimeoutFn } from 'react-use'
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

  useTimeoutFn(async () => {
    if (window.sessionStorage.getItem(SESSIONSTORAGE.POST_VIEW_SUBMITTED(id)) == '1') return
    if (!post?.published) return
    await postPostView(id)
    window.sessionStorage.setItem(SESSIONSTORAGE.POST_VIEW_SUBMITTED(id), '1')
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
              <Link className="s-link hover:s-underline" href={`/categories/${category.name}/1`}>
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
