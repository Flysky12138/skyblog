import DisplayMatchAuth from '@/components/display/DisplayMatchAuth'
import Card from '@/components/layout/Card'
import { MDXServer } from '@/components/mdx/server'
import { MDXToc } from '@/components/mdx/toc'
import { cn } from '@/lib/cn'
import { ATTRIBUTE } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Edit } from '@mui/icons-material'
import { IconButton, Tooltip, Typography } from '@mui/joy'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PostInfo from './_components/PostInfo'
// import PostIssues from './_components/PostIssues'
import PostTocWrapper from './_components/PostTocWrapper'

const getPost = async (id: string) => {
  return await prisma.post.findUnique({
    include: { author: true, categories: true, tags: true },
    where: { id }
  })
}

interface PageProps extends DynamicRoute<{ id: string }> {}

export const generateStaticParams = async (): Promise<Array<PageProps['params']>> => {
  const posts = await prisma.post.findMany({ select: { id: true } })
  return posts.map(post => ({ id: post.id }))
}
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const post = await getPost(params.id)
  if (!post) return {}
  return {
    category: post.categories.map(({ name }) => name).join(','),
    creator: post.author.name,
    description: post.description,
    keywords: post.tags.map(({ name }) => name).join(','),
    title: post.title
  }
}

export default async function Page({ params }: PageProps) {
  const post = await getPost(params.id)
  if (!post) return notFound()

  return (
    <section className="space-y-5">
      {post.showTitleCard && (
        <Card className="relative flex flex-col gap-y-2 p-5">
          <DisplayMatchAuth role="ADMIN">
            <Tooltip title="编辑">
              <IconButton className="absolute right-5 top-5" component={Link} href={`/dashboard/posts/${post.id}`} target="_blank" variant="plain">
                <Edit />
              </IconButton>
            </Tooltip>
          </DisplayMatchAuth>
          <Typography className="font-title font-normal" component="h1" level="h2">
            {post.title}
          </Typography>
          {post.description && <Typography level="body-md">{post.description}</Typography>}
          <PostInfo
            defaultValue={{
              categories: post.categories,
              createdAt: post.createdAt,
              links: post.links,
              published: post.published,
              updatedAt: post.updatedAt,
              views: post.views
            }}
            id={post.id}
          />
        </Card>
      )}
      {post.content && (
        <section className="flex gap-x-4">
          <style>{`html { scroll-padding-top: 60px }`}</style>
          <Card className="max-w-none grow" component="article" id={ATTRIBUTE.ID.POST_CONTAINER}>
            <MDXServer value={post.content} />
          </Card>
          <Card
            className={cn([
              'hidden empty:hidden lg:block',
              's-hidden-scrollbar sticky w-52 shrink-0 space-y-1.5 self-start overflow-auto p-3 pr-1.5',
              'top-[calc(theme(height.header)+theme(height.9))] max-h-[calc(100dvh-theme(height.header)-2*theme(height.9))]'
            ])}
            component={PostTocWrapper}
          >
            <MDXToc value={post.content} />
          </Card>
        </section>
      )}
      {/* <PostIssues /> */}
    </section>
  )
}
