import { Prisma } from '@prisma/client'
import { Award, CalendarDays, LucideIcon, Shapes, Tag } from 'lucide-react'
import Link from 'next/link'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'

import { getPosts } from '../../utils'
import { PostListPagination, PostListPaginationProps } from './post-list-pagination'
import { PostUpdateAt } from './post-update-at'

export type PostSearchParams = Record<Extract<keyof Prisma.PostWhereInput, 'categories' | 'tags'>, string>

interface PostListProps {
  pagination: PostListPaginationProps
  posts: Awaited<ReturnType<typeof getPosts>>['result']
}

export const PostList = ({ pagination, posts }: PostListProps) => {
  if (pagination.count == 0) {
    return <span className="text-center">空空如也</span>
  }

  return (
    <>
      {posts.map(post => (
        <Card key={post.id} className="p-card space-y-3 break-all lg:space-y-4">
          <h2 className="flex items-center gap-2">
            {post.sticky > 0 && <Award size={20} />}
            <Link className="font-title hover:text-link-foreground focus-within:text-link-foreground text-xl" href={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </h2>
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
                    <Link className="hover:text-link-foreground focus-visible:text-link-foreground" href={`/search?${item.key}=${it.name}`}>
                      {it.name}
                    </Link>
                    {index < post[item.key].length - 1 ? ',' : null}
                  </span>
                ))}
              </DisplayByConditional>
            ))}
          </div>
          {post.description && <p className="text-subtitle-foreground line-clamp-3 text-sm">{post.description}</p>}
        </Card>
      ))}
      <PostListPagination {...pagination} />
    </>
  )
}
