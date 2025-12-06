import { pick } from 'es-toolkit'
import { Award, CalendarDays, LucideIcon, Shapes, Tag } from 'lucide-react'
import Link from 'next/link'

import { Card } from '@/components/static/card'
import { Prisma } from '@/generated/prisma/client'
import { fromNow } from '@/lib/parser/time'

import { PostPagination } from './_components/post-pagination'
import { PostSort } from './_components/post-sort'
import { getPostList, PostSearchParamsSchema } from './utils'

type PostWhereInputKey = Extract<keyof Prisma.PostWhereInput, 'categories' | 'tags'>

export default async function Page({ searchParams }: PageProps<'/'>) {
  const params = await PostSearchParamsSchema.parseAsync(pick(await searchParams, ['categories', 'order', 'page', 'sortord', 'tags']))

  const { pagination, posts } = await getPostList(params)

  if (pagination.totalCount == 0) {
    return <span className="text-center">空空如也</span>
  }

  return (
    <>
      <div className="-order-1 flex">
        <PostSort className="ml-auto" order={params.order} sortord={params.sortord} />
      </div>

      {posts.map(post => (
        <Card key={post.id} className="p-card space-y-3 break-all lg:space-y-4">
          <h2 className="flex items-center gap-2">
            {post.pinOrder > 0 && <Award size={20} />}
            <Link className="font-title hover:text-link-foreground focus-within:text-link-foreground text-xl" href={`/posts/${post.slug ?? post.id}`}>
              {post.title}
            </Link>
          </h2>
          <div className="text-secondary-foreground flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
            <CalendarDays size={12} />
            <>更新于 {fromNow(post.updatedAt)}</>
            {/* <Typography endDecorator="·" level="body-xs" startDecorator={<QuestionAnswerRounded sx={{ fontSize: '1.1em' }} />}>
              评论数 {0}
            </Typography> */}
            <PostCategroyTag Icon={Shapes} queryKey="categories" values={post.categories.map(({ category }) => category)} />
            <PostCategroyTag Icon={Tag} queryKey="tags" values={post.tags.map(({ tag }) => tag)} />
          </div>
          {post.summary && <p className="text-muted-foreground line-clamp-3 text-sm">{post.summary}</p>}
        </Card>
      ))}

      <PostPagination {...pagination} />
    </>
  )
}

function PostCategroyTag({ Icon, queryKey, values }: { Icon: LucideIcon; queryKey: PostWhereInputKey; values: { id: string; name: string }[] }) {
  if (values.length == 0) return null

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
