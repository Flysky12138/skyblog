import { Prisma } from '@prisma/client'
import { toMerged } from 'es-toolkit'
import { Award, CalendarDays, Shapes, Tag } from 'lucide-react'
import Link from 'next/link'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/layout/card'
import prisma from '@/lib/prisma'

import { PostListPagination, PostListPaginationProps } from './post-list-pagination'
import { PostUpdateAt } from './post-update-at'

export const POST_WHERE_INPUT: Prisma.PostWhereInput = {
  published: true
}

export const getPosts = async (page: number, where: Prisma.PostWhereInput = {}) => {
  const data = await prisma.post.paginate(
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
  return {
    ...data,
    totalPages: data.totalPages
  }
}

interface PostListProps extends PostListPaginationProps {
  posts: Prisma.PromiseReturnType<typeof getPosts>['result'] | undefined
}

export const PostList = ({ posts, ...props }: PostListProps) => {
  if (!posts || posts.length == 0) {
    return <span className="text-center">空空如也</span>
  }

  return (
    <>
      {posts.map(post => (
        <Card key={post.id} className="space-y-4 p-5 break-all">
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
            <DisplayByConditional condition={post.categories.length > 0}>
              · <Shapes size={12} />
              {post.categories.map((category, index) => (
                <span key={category.id}>
                  <Link className="hover:text-link-foreground focus-visible:text-link-foreground" href={`/search?categories=${category.name}`}>
                    {category.name}
                  </Link>
                  {index < post.categories.length - 1 ? ',' : null}
                </span>
              ))}
            </DisplayByConditional>
            <DisplayByConditional condition={post.tags.length > 0}>
              · <Tag size={12} />
              {post.tags.map((tag, index) => (
                <span key={tag.id}>
                  <Link className="hover:text-link-foreground focus-visible:text-link-foreground" href={`/search?tags=${tag.name}`}>
                    {tag.name}
                  </Link>
                  {index < post.tags.length - 1 ? ',' : null}
                </span>
              ))}
            </DisplayByConditional>
          </div>
          {post.description && <span className="text-subtitle-foreground line-clamp-3 text-sm">{post.description}</span>}
        </Card>
      ))}
      <DisplayByConditional condition={(props?.totalPages || 0) > 1}>
        <PostListPagination {...props} />
      </DisplayByConditional>
    </>
  )
}
