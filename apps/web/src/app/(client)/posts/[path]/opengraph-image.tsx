import { Blog } from '@repo/ui/components/og/blog'
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'

import { TimeHelper } from '@/lib/helper/time'

import { getPost } from './utils'

export const alt = process.env.NEXT_PUBLIC_TITLE
export const size = {
  height: 630,
  width: 1200
}

export default async function OpengraphImage({ params }: PageProps<'/posts/[path]'>) {
  const { path: idOrSlug } = await params

  const { post, user } = await getPost(idOrSlug)

  const base64 = await readFile(new URL('~/public/icons/icon-256x256.png', import.meta.url), 'base64')
  const src = `data:image/png;base64,${base64}`

  if (!post) return null

  return new ImageResponse(
    <Blog
      author={user?.name ?? 'unknown'}
      brand={process.env.NEXT_PUBLIC_TITLE}
      category={post.categories.map(({ category }) => category.name).join('、')}
      excerpt={post.summary ?? ''}
      logo={src}
      meta={TimeHelper.formatDate(post.updatedAt)}
      title={post.title}
    />,
    {
      ...size
    }
  )
}
