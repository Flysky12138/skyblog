import { PencilLine } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DisplayByAuth } from '@/components/display/display-by-auth'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/layout/card'
import { MDXPickHeading } from '@/components/mdx/pick-heading'
import { MDXServer } from '@/components/mdx/server'
import { Button } from '@/components/ui/button'
import { ATTRIBUTE, POST_CARD_DISPLAY } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

import { PostCatalogue, PostCatalogueHeading } from './_components/post-catalogue'
import { PostInfo } from './_components/post-info'
import { ResizeButton } from './_components/resize-button'

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

const getPost = async (id: string) => {
  return await prisma.post.findUnique({
    include: {
      author: true,
      categories: true,
      tags: true
    },
    where: { id }
  })
}

interface PageProps extends DynamicRouteProps<{ id: string }> {}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const post = await getPost(id)
  if (!post) return notFound()

  return (
    <>
      <DisplayByConditional condition={(post.display & POST_CARD_DISPLAY.HEADER) == POST_CARD_DISPLAY.HEADER}>
        <Card aria-label="post abstract" className="relative flex flex-col gap-2 p-3 md:p-5" data-slot="post-abstract">
          <DisplayByAuth role="ADMIN">
            <Button asChild className="absolute top-5 right-5" size="icon" variant="ghost">
              <Link href={`/dashboard/posts/${post.id}`} target="_blank">
                <PencilLine />
              </Link>
            </Button>
          </DisplayByAuth>
          <h1 className="font-title text-2xl font-normal md:text-3xl">{post.title}</h1>
          {post.description && <p className="text-subtitle-foreground">{post.description}</p>}
          <PostInfo defaultValue={post} id={post.id} />
        </Card>
      </DisplayByConditional>
      {post.content && (
        <div className="flex gap-5">
          <style>{`html { scroll-padding-top: 60px }`}</style>
          <Card asChild aria-label="post content">
            <article className="group/article relative max-w-none grow px-3 py-5 md:px-5" id={ATTRIBUTE.ID.POST_CONTAINER}>
              <ResizeButton className="absolute top-1 right-1 z-10 opacity-0 group-hover/article:opacity-100 focus-visible:opacity-100 [&+*]:mt-0" />
              <MDXServer source={post.content} />
            </article>
          </Card>
          <DisplayByConditional condition={(post.display & POST_CARD_DISPLAY.TOC) == POST_CARD_DISPLAY.TOC}>
            <Card asChild aria-label="post catalogue">
              <PostCatalogue>
                <MDXPickHeading headingComponent={PostCatalogueHeading} source={post.content} />
              </PostCatalogue>
            </Card>
          </DisplayByConditional>
        </div>
      )}
    </>
  )
}
