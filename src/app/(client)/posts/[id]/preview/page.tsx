'use client'

import React from 'react'
import { useEvent, useMount } from 'react-use'

import { DefaultPostType, MessageEventDataMountedType, MessageEventDataRefreshType } from '@/app/dashboard/posts/[id]/page'
import { Card } from '@/components/layout/card'
import { MDXClient } from '@/components/mdx/client'

export default function Page() {
  const [post, setPost] = React.useState<DefaultPostType>()

  useMount(() => {
    window.opener.postMessage({ type: 'post-preview-mounted' } satisfies MessageEventDataMountedType, window.origin)
  })

  useEvent('message', ({ data, origin }: MessageEvent<MessageEventDataRefreshType>) => {
    if (origin != window.origin || data.type != 'post-refresh') return
    setPost(data.value)
  })

  if (!post || !post.content) return null

  return (
    <Card asChild>
      <article className="max-w-none p-5">
        <MDXClient value={post.content} />
      </article>
    </Card>
  )
}
