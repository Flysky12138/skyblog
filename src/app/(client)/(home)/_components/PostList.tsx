import Card from '@/components/layout/Card'
import PaginationForServer, { PaginationForServerProps } from '@/components/pagination/PaginationForServer'
import prisma from '@/lib/prisma'
import { CalendarMonth, Category, Loyalty, Publish } from '@mui/icons-material'
import { Typography } from '@mui/joy'
import { Prisma } from '@prisma/client'
import { toMerged } from 'es-toolkit'
import Link from 'next/link'
import React from 'react'
import PostUpdateAt from './PostUpdateAt'

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
      page,
      limit: Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT)
    }
  )
  return {
    ...data,
    totalPages: data.totalPages
  }
}

interface PostListProps extends Pick<PaginationForServerProps, 'path'> {
  page: number
  posts: Prisma.PromiseReturnType<typeof getPosts> | undefined
}

export default function PostList({ posts, ...props }: PostListProps) {
  if (!posts || posts.count == 0) {
    return (
      <Typography className="text-center" level="body-md">
        空空如也
      </Typography>
    )
  }

  return (
    <>
      {posts.result.map(post => (
        <Card key={post.id} className="space-y-4 break-all p-5">
          <Typography
            className="inline-block font-title font-normal hover:text-sky-500 focus-visible:text-sky-500"
            component={Link}
            href={`/posts/${post.id}`}
            level="h4"
            slotProps={{
              startDecorator: {
                className: 'align-middle'
              }
            }}
            {...(post.sticky > 0 && {
              startDecorator: <Publish color="error" />
            })}
          >
            {post.title}
          </Typography>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1">
            <Typography level="body-xs" startDecorator={<CalendarMonth sx={{ fontSize: '1.1em' }} />}>
              <PostUpdateAt value={post.updatedAt} />
            </Typography>
            {/* <Typography endDecorator="·" level="body-xs" startDecorator={<QuestionAnswerRounded sx={{ fontSize: '1.1em' }} />}>
              评论数 {0}
            </Typography> */}
            {post.categories.length > 0 ? (
              <>
                <Typography level="body-xs">·</Typography>
                <Typography level="body-xs" startDecorator={<Category sx={{ fontSize: '1.1em' }} />}>
                  {post.categories.map((category, index) => (
                    <React.Fragment key={category.id}>
                      <Link className="hover:s-underline hover:text-sky-500 focus-visible:text-sky-500" href={`/search?categories=${category.name}`}>
                        {category.name}
                      </Link>
                      {index < post.categories.length - 1 ? '、' : null}
                    </React.Fragment>
                  ))}
                </Typography>
              </>
            ) : null}
            {post.tags.length > 0 ? (
              <>
                <Typography level="body-xs">·</Typography>
                <Typography level="body-xs" startDecorator={<Loyalty sx={{ fontSize: '1.1em' }} />}>
                  {post.tags.map((tag, index) => (
                    <React.Fragment key={tag.id}>
                      <Link className="hover:s-underline hover:text-sky-500 focus-visible:text-sky-500" href={`/search?tags=${tag.name}`}>
                        {tag.name}
                      </Link>
                      {index < post.tags.length - 1 ? '、' : null}
                    </React.Fragment>
                  ))}
                </Typography>
              </>
            ) : null}
          </div>
          {post.description && (
            <Typography className="line-clamp-3" level="body-sm">
              {post.description}
            </Typography>
          )}
        </Card>
      ))}
      <PaginationForServer className="mx-auto" count={Math.ceil(posts.count / posts.limit)} {...props} />
    </>
  )
}
