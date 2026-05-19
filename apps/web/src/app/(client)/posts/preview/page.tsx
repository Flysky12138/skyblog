'use client'

import { MDXClient } from '@repo/mdx'
import { useBroadcastChannel } from '@repo/react-hooks'
import { useMount } from '@repo/react-hooks'
import React from 'react'

import {
  MessageEventDataPostPreviewMounted,
  MessageEventDataPostUpdate,
  POST_PREVIEW_BROADCAST_CHANNEL_ID,
  PostType
} from '@/app/dashboard/posts/[id]/utils'

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
    <MDXClient
      componentsProps={{
        wrapper: {
          className: 'max-w-none p-card'
        }
      }}
      source={post.content}
    />
  )
}
