'use client'

import React from 'react'
import { useEvent, useMount } from 'react-use'

import { DefaultPostType, MessageEventDataMounted, MessageEventDataRefresh } from '@/app/dashboard/posts/[id]/page'
import { MDXClient } from '@/components/mdx/client'
import { Card } from '@/components/static/card'

export default function Page() {
  const [post, setPost] = React.useState<DefaultPostType>()

  useMount(() => {
    window.opener.postMessage({ type: 'post-preview-mounted' } satisfies MessageEventDataMounted, window.origin)
  })

  useEvent('message', ({ data, origin }: MessageEvent<MessageEventDataRefresh>) => {
    if (origin != window.origin || data.type != 'post-refresh') return
    setPost(data.value)
  })

  if (!post?.content) return null

  return (
    <Card asChild>
      <article className="max-w-none p-5">
        <MDXClient source={post.content} />
      </article>
    </Card>
  )
}
