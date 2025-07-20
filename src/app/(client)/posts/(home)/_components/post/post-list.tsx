import { Prisma } from '@prisma/client'
import { toMerged } from 'es-toolkit'
import { Award, CalendarDays, LucideIcon, Shapes, Tag } from 'lucide-react'
import Link from 'next/link'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/layout/card'
import { prisma } from '@/lib/prisma'

import { PostListPagination, PostListPaginationProps } from './post-list-pagination'
import { PostUpdateAt } from './post-update-at'

export type PostSearchParams = Record<Extract<keyof Prisma.PostWhereInput, 'categories' | 'tags'>, string>

interface PostListProps {
  pagination: PostListPaginationProps
  posts: Prisma.PromiseReturnType<typeof getPosts>['result']
}

export const PostList = ({ pagination, posts }: PostListProps) => {
  if (pagination.count == 0) {
    return <span className="text-center">空空如也</span>
  }

  return (
    <>
      {posts.map(post => (
        <Card key={post.id} className="p-card space-y-3 break-all lg:space-y-4">
          <div className="flex items-center gap-2">
            {post.sticky > 0 && <Award size={20} />}
            <Link className="font-title hover:text-link-foreground focus-within:text-link-foreground text-xl" href={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
            <CalendarDays size={12} />
            <PostUpdateAt value={post.updatedAt} />
            {/* <Typography endDecorator="·" level="body-xs" startDecorator={<QuestionAnswerRounded sx={{ fontSize: '1.1em' }} />}>
              评论数 {0}
            </Typography> */}
            {Array.from<{ icon: LucideIcon; key: keyof PostSearchParams }>([
              { icon: Shapes, key: 'categories' },
              { icon: Tag, key: 'tags' }
            ]).map(item => (
              <DisplayByConditional key={item.key} condition={post[item.key].length > 0}>
                <span>·</span>
                <item.icon size={12} />
                {post[item.key].map((it, index) => (
                  <span key={it.id}>
                    <Link className="hover:text-link-foreground focus-visible:text-link-foreground" href={`/posts/search?${item.key}=${it.name}`}>
                      {it.name}
                    </Link>
                    {index < post[item.key].length - 1 ? ',' : null}
                  </span>
                ))}
              </DisplayByConditional>
            ))}
          </div>
          {post.description && <span className="text-subtitle-foreground line-clamp-3 text-sm">{post.description}</span>}
        </Card>
      ))}
      <PostListPagination {...pagination} />
    </>
  )
}

/** 文章查询过滤器 */
export const POST_WHERE_INPUT: Prisma.PostWhereInput = {
  published: true
}

/** 文章查询 */
export const getPosts = async (page: number, where: Prisma.PostWhereInput = {}) => {
  return await prisma.post.paginate(
    {
      orderBy: [{ sticky: 'desc' }, { updatedAt: 'desc' }],
      select: {
        categories: true,
        createdAt: true,
        description: true,
        id: true,
        sticky: true,
        tags: true,
        title: true,
        updatedAt: true
      },
      where: toMerged(POST_WHERE_INPUT, where)
    },
    {
      limit: Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT),
      page
    }
  )
}
