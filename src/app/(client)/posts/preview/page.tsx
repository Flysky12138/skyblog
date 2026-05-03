'use client'

import React from 'react'
import { useMount } from 'react-use'

import {
  MessageEventDataPostPreviewMounted,
  MessageEventDataPostUpdate,
  POST_PREVIEW_BROADCAST_CHANNEL_ID,
  PostType
} from '@/app/dashboard/posts/[id]/utils'
import { MDXClient } from '@/components/mdx/client'
import { Card } from '@/components/static/card'
import { useBroadcastChannel } from '@/hooks/use-broadcast-channel'

export default function Page() {
  const [post, setPost] = React.useState<PostType>()

  const { postMessage } = useBroadcastChannel<MessageEventDataPostUpdate, MessageEventDataPostPreviewMounted>(
    POST_PREVIEW_BROADCAST_CHANNEL_ID,
    ({ type, value }) => {
      if (type != 'post-update') return
      setPost(value)
    }
  )

  useMount(() => {
    postMessage({ type: 'post-preview-mounted' })
  })

  if (!post?.content) return null

  return (
    <Card className="p-card max-w-none" render={<article />}>
      <MDXClient source={post.content} />
    </Card>
  )
}
