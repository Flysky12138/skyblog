'use cache'

import { ChevronLeftIcon, ChevronRightIcon, PencilLine } from 'lucide-react'
import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DisplayByAuth } from '@/components/display/display-by-auth'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { MDXPickHeading } from '@/components/mdx/pick-heading'
import { MDXServer } from '@/components/mdx/server'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { ATTRIBUTE, POST_CARD_DISPLAY } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

import { POST_WHERE_INPUT } from '../../utils'
import { PostCatalogue, PostCatalogueHeading } from './_components/post-catalogue'
import { PostInfo } from './_components/post-info'
import { ResizeButton } from './_components/resize-button'
import { getPost, getPostsRecommend } from './utils'

export const generateStaticParams = async (): Promise<Awaited<PageProps<'/posts/[id]'>['params']>[]> => {
  const posts = await prisma.post.findMany({ select: { id: true }, where: POST_WHERE_INPUT })
  return posts.map(post => ({ id: post.id }))
}

export const generateMetadata = async ({ params }: PageProps<'/posts/[id]'>): Promise<Metadata> => {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return {}
  return {
    category: post.categories.map(({ name }) => name).join(','),
    creator: post.author.name,
    description: post.description,
    keywords: post.tags.map(({ name }) => name),
    openGraph: {
      description: post.description || undefined,
      title: post.title,
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${id}`
    },
    title: post.title,
    twitter: {
      description: post.description || undefined,
      title: post.title
    }
  }
}

export default async function Page({ params }: PageProps<'/posts/[id]'>) {
  cacheLife('max')

  const { id } = await params

  const post = await getPost(id)
  if (!post) return notFound()

  const { next, prev } = await getPostsRecommend(post)

  return (
    <>
      <style>{`html { scroll-padding-top: 60px }`}</style>
      <DisplayByConditional condition={(post.display & POST_CARD_DISPLAY.HEADER) == POST_CARD_DISPLAY.HEADER}>
        <Card aria-label="post abstract" className="relative flex flex-col gap-2 p-3 md:p-5" data-slot="post-abstract">
          <DisplayByAuth role="ADMIN">
            <Button asChild className="absolute top-3 right-3 md:top-5 md:right-5" size="icon" variant="ghost">
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
        <div className="gap-card-small flex">
          <div className="gap-card-large grid w-full">
            <Card asChild aria-label="post content">
              <article className="group/article relative max-w-none grow px-3 py-5 md:px-5" id={ATTRIBUTE.ID.POST_CONTAINER}>
                <ResizeButton className="absolute top-1 right-1 z-10 opacity-0 group-hover/article:opacity-100 focus-visible:opacity-100 [&+*]:mt-0" />
                <MDXServer source={post.content} />
              </article>
            </Card>
            <DisplayByConditional condition={!!prev || !!next}>
              <div className="gap-card-small grid sm:grid-cols-2">
                {prev && (
                  <Card asChild aria-label="Previous Post">
                    <Item asChild variant="muted">
                      <Link href={`/posts/${prev.id}`}>
                        <ItemMedia>
                          <ChevronLeftIcon size={24} />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="text-base">Previous</ItemTitle>
                          <ItemDescription>{prev.title}</ItemDescription>
                        </ItemContent>
                      </Link>
                    </Item>
                  </Card>
                )}
                {next && (
                  <Card asChild aria-label="Next Post" className="sm:col-start-2">
                    <Item asChild variant="muted">
                      <Link href={`/posts/${next.id}`}>
                        <ItemContent className="items-end">
                          <ItemTitle className="text-base">Next</ItemTitle>
                          <ItemDescription>{next.title}</ItemDescription>
                        </ItemContent>
                        <ItemMedia>
                          <ChevronRightIcon size={24} />
                        </ItemMedia>
                      </Link>
                    </Item>
                  </Card>
                )}
              </div>
            </DisplayByConditional>
          </div>
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
