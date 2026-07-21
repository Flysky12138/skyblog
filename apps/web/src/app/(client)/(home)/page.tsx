import { Card } from '@repo/ui/components-self/card'
import { pick } from 'es-toolkit'
import { AwardIcon, ShapesIcon, TagIcon } from 'lucide-react'
import Link from 'next/link'

import { PostCategroyTag } from './_components/post-categroy-tag'
import { PostPagination } from './_components/post-pagination'
import { PostSort } from './_components/post-sort'
import { PostUpdateAt } from './_components/post-update-at'
import { getPostList, PostSearchParamsSchema } from './utils'

export default async function Page({ searchParams }: PageProps<'/'>) {
  const params = await PostSearchParamsSchema.parseAsync(pick(await searchParams, PostSearchParamsSchema.keyof().options))

  const { pagination, posts } = await getPostList(params)

  if (pagination.totalCount === 0) {
    return <span className="text-center">空空如也</span>
  }

  return (
    <>
      <div className="-order-1 flex">
        <PostSort className="ml-auto" direction={params.direction} field={params.field} />
      </div>

      {posts.map(post => (
        <Card key={post.id} className="space-y-3 p-card break-all lg:space-y-4">
          <h2 className="flex items-center gap-2">
            {post.pinOrder > 0 && <AwardIcon size={20} />}
            <Link
              className="font-heading text-xl focus-within:text-link-foreground hover:text-link-foreground"
              href={`/posts/${post.slug ?? post.id}`}
            >
              {post.title}
            </Link>
          </h2>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-secondary-foreground">
            <PostUpdateAt updatedAt={post.updatedAt} />
            {/* <Typography endDecorator="·" level="body-xs" startDecorator={<QuestionAnswerRounded sx={{ fontSize: '1.1em' }} />}>
              评论数 {0}
            </Typography> */}
            <PostCategroyTag icon={ShapesIcon} queryKey="categories" values={post.categories.map(({ category }) => category)} />
            <PostCategroyTag icon={TagIcon} queryKey="tags" values={post.tags.map(({ tag }) => tag)} />
          </div>
          {post.summary && <p className="line-clamp-3 text-sm text-muted-foreground">{post.summary}</p>}
        </Card>
      ))}

      <PostPagination {...pagination} />
    </>
  )
}
