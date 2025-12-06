import { Award, CalendarDays, LucideIcon, Shapes, Tag } from 'lucide-react'
import Link from 'next/link'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { fromNow } from '@/lib/parser/time'
import { Prisma } from '@/prisma/client'

import { getPosts } from '../utils'
import { PostListPagination } from './_components/post-list-pagination'

type PostSearchParams = Partial<Record<'page' | PostWhereInputKey, string>>
type PostWhereInputKey = Extract<keyof Prisma.PostWhereInput, 'categories' | 'tags'>

export default async function Page({ searchParams }: PageProps<'/'>) {
  const { categories, page = '1', tags } = (await searchParams) as PostSearchParams

  const pageNumber = Number.parseInt(page) || 1

  const { pagination, posts } = await getPosts(pageNumber, {
    categories: categories ? { some: { name: decodeURIComponent(categories) } } : undefined,
    tags: tags ? { some: { name: decodeURIComponent(tags) } } : undefined
  })

  if (pagination.totalCount == 0) {
    return <span className="text-center">空空如也</span>
  }

  return (
    <>
      {posts.map(post => (
        <Card key={post.id} className="p-card space-y-3 break-all lg:space-y-4">
          <h2 className="flex items-center gap-2">
            {post.pinOrder > 0 && <Award size={20} />}
            <Link className="font-title hover:text-link-foreground focus-within:text-link-foreground text-xl" href={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </h2>
          <div className="text-secondary-foreground flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
            <CalendarDays size={12} />
            <>更新于 {fromNow(post.updatedAt)}</>
            {/* <Typography endDecorator="·" level="body-xs" startDecorator={<QuestionAnswerRounded sx={{ fontSize: '1.1em' }} />}>
              评论数 {0}
            </Typography> */}
            {Array.from<{ icon: LucideIcon; key: PostWhereInputKey }>([
              { icon: Shapes, key: 'categories' },
              { icon: Tag, key: 'tags' }
            ]).map(item => (
              <DisplayByConditional key={item.key} condition={post[item.key].length > 0}>
                <span>·</span>
                <item.icon size={12} />
                {post[item.key].map((it, index) => (
                  <span key={it.id}>
                    <Link
                      className="hover:text-link-foreground focus-visible:text-link-foreground"
                      href={{
                        pathname: '/',
                        query: {
                          [item.key]: it.name
                        }
                      }}
                    >
                      {it.name}
                    </Link>
                    {index < post[item.key].length - 1 ? ',' : null}
                  </span>
                ))}
              </DisplayByConditional>
            ))}
          </div>
          {post.summary && <p className="text-muted-foreground line-clamp-3 text-sm">{post.summary}</p>}
        </Card>
      ))}
      <PostListPagination {...pagination} />
    </>
  )
}
