'use client'

import React from 'react'
import { useMount } from 'react-use'

import { BROADCAST_CHANNEL_ID, DefaultPostType, MessageEventDataMounted, MessageEventDataRefresh } from '@/app/dashboard/posts/[id]/utils'
import { MDXClient } from '@/components/mdx/client'
import { Card } from '@/components/static/card'
import { useBroadcastChannel } from '@/hooks/use-broadcast-channel'

export default function Page() {
  const [post, setPost] = React.useState<DefaultPostType>()

  const { postMessage } = useBroadcastChannel<MessageEventDataRefresh, MessageEventDataMounted>(BROADCAST_CHANNEL_ID, ({ type, value }) => {
    if (type != 'post-refresh') {
      return
    }
    setPost(value)
  })

  useMount(() => {
    postMessage({ type: 'post-preview-mounted' })
  })

  if (!post?.content) {
    return null
  }

  return (
    <Card asChild>
      <article className="max-w-none p-5">
        <MDXClient source={post.content} />
      </article>
    </Card>
  )
}
