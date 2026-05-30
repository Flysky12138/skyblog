import { Card } from '@repo/ui/components-self/card'
import { pick } from 'es-toolkit'
import { AwardIcon, CalendarDaysIcon, LucideIcon, ShapesIcon, TagIcon } from 'lucide-react'
import Link from 'next/link'

import { Prisma } from '@/generated/prisma/client'
import { TimeHelper } from '@/lib/helper/time'

import { PostPagination } from './_components/post-pagination'
import { PostSort } from './_components/post-sort'
import { getPostList, PostSearchParamsSchema } from './utils'

type PostWhereInputKey = Extract<keyof Prisma.PostWhereInput, 'categories' | 'tags'>

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
            <CalendarDaysIcon size={12} />
            <>更新于 {TimeHelper.fromNow(post.updatedAt)}</>
            {/* <Typography endDecorator="·" level="body-xs" startDecorator={<QuestionAnswerRounded sx={{ fontSize: '1.1em' }} />}>
              评论数 {0}
            </Typography> */}
            <PostCategroyTag Icon={ShapesIcon} queryKey="categories" values={post.categories.map(({ category }) => category)} />
            <PostCategroyTag Icon={TagIcon} queryKey="tags" values={post.tags.map(({ tag }) => tag)} />
          </div>
          {post.summary && <p className="line-clamp-3 text-sm text-muted-foreground">{post.summary}</p>}
        </Card>
      ))}

      <PostPagination {...pagination} />
    </>
  )
}

function PostCategroyTag({ Icon, queryKey, values }: { Icon: LucideIcon; queryKey: PostWhereInputKey; values: { id: string; name: string }[] }) {
  if (values.length === 0) return null

  return (
    <>
      <span>·</span>
      <Icon size={12} />
      {values.map(({ id, name }, index) => (
        <span key={id}>
          <Link
            className="hover:text-link-foreground focus-visible:text-link-foreground"
            href={{
              pathname: '/',
              query: {
                [queryKey]: name
              }
            }}
          >
            {name}
          </Link>
          {index < values.length - 1 ? ',' : null}
        </span>
      ))}
    </>
  )
}
