import { DisplayByAuth } from '@/components/display/display-by-auth'
import { Card } from '@/components/layout/card'
import { cn } from '@/lib/cn'
import { ATTRIBUTE, POST_CARD_DISPLAY } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostInfo } from './_components/post-info'
// import PostIssues from './_components/PostIssues'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MDXServer } from '@/components/mdx/server'
import { MDXToc } from '@/components/mdx/toc'
import { Button } from '@/components/ui/button'
import { PencilLine } from 'lucide-react'
import { PostTocWrapper } from './_components/post-toc-wrapper'

const getPost = async (id: string) => {
  return await prisma.post.findUnique({
    include: { author: true, categories: true, tags: true },
    where: { id }
  })
}

interface PageProps extends DynamicRouteProps<{ id: string }> {}

export const generateStaticParams = async (): Promise<Awaited<PageProps['params']>[]> => {
  const posts = await prisma.post.findMany({ select: { id: true } })
  return posts.map(post => ({ id: post.id }))
}
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params

  const post = await getPost(id)
  if (!post) return {}
  return {
    category: post.categories.map(({ name }) => name).join(','),
    creator: post.author.name,
    description: post.description,
    keywords: post.tags.map(({ name }) => name),
    title: post.title
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const post = await getPost(id)
  if (!post) return notFound()

  return (
    <section className="space-y-5">
      <DisplayByConditional condition={(post.display & POST_CARD_DISPLAY.HEADER) == POST_CARD_DISPLAY.HEADER}>
        <Card className="relative flex flex-col gap-2 p-5">
          <DisplayByAuth role="ADMIN">
            <Button asChild className="absolute top-5 right-5" size="icon" variant="ghost">
              <Link href={`/dashboard/posts/${post.id}`} target="_blank">
                <PencilLine />
              </Link>
            </Button>
          </DisplayByAuth>
          <p className="font-title text-3xl font-normal">{post.title}</p>
          {post.description && <p className="text-subtitle-foreground">{post.description}</p>}
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
      </DisplayByConditional>
      {post.content && (
        <section className="flex gap-4">
          <style>{`html { scroll-padding-top: 60px }`}</style>
          <Card asChild className="max-w-none grow">
            <article id={ATTRIBUTE.ID.POST_CONTAINER}>
              <MDXServer value={post.content} />
            </article>
          </Card>
          <DisplayByConditional condition={(post.display & POST_CARD_DISPLAY.TOC) == POST_CARD_DISPLAY.TOC}>
            <Card
              asChild
              className={cn(
                'hidden empty:hidden lg:block',
                'scrollbar-hidden font-article w-52 shrink-0 space-y-1.5 self-start overflow-auto p-3 pr-1.5',
                'sticky top-[calc(var(--height-header)+--spacing(9))] max-h-[calc(100dvh-var(--height-header)---spacing(18))]'
              )}
            >
              <PostTocWrapper>
                <MDXToc value={post.content} />
              </PostTocWrapper>
            </Card>
          </DisplayByConditional>
        </section>
      )}
      {/* <PostIssues /> */}
    </section>
  )
}
