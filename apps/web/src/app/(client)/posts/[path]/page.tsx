'use cache'

import { Card } from '@repo/ui/components-self/card'
import { JsonLD } from '@repo/ui/components-self/json-ld'
import { ButtonLink } from '@repo/ui/components/button'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@repo/ui/components/item'
import { cn } from '@repo/ui/lib/utils'
import { PencilLineIcon } from 'lucide-react'
import { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DisplayByAuth } from '@/components/display/display-by-auth'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Style } from '@/components/style'
import { ATTRIBUTE, CACHE_TAG, POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { Storage } from '@/lib/http/storage'

import { getPosts, getPrevNextPost } from '../utils'
import { PostInfo } from './_components/post-info'
import { PostResizeButton } from './_components/post-resize-button'
import { getPost } from './utils'

export const generateStaticParams = async (): Promise<Awaited<PageProps<'/posts/[path]'>['params']>[]> => {
  const posts = await getPosts()
  return posts.map(post => ({ path: post.slug ?? post.id }))
}

export const generateMetadata = async ({ params }: PageProps<'/posts/[path]'>): Promise<Metadata> => {
  cacheLife('max')

  const { path: idOrSlug } = await params

  const { post, user } = await getPost(idOrSlug)
  if (!post) return {}

  cacheTag(CACHE_TAG.POST(post.id))

  return {
    category: post.categories.map(({ category }) => category.name).join(','),
    creator: user?.name,
    description: post.summary,
    keywords: post.tags.map(({ tag }) => tag.name),
    title: post.title,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${idOrSlug}`
    },
    openGraph: {
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${idOrSlug}`
    }
  }
}

export default async function Page({ params }: PageProps<'/posts/[path]'>) {
  cacheLife('max')

  const { path: idOrSlug } = await params

  const { post, user } = await getPost(idOrSlug)
  if (!post) return notFound()

  cacheTag(CACHE_TAG.POST(post.id))

  const { next, prev } = await getPrevNextPost(post)

  return (
    <>
      <JsonLD
        json={{
          '@type': 'BlogPosting',
          dateModified: post.updatedAt.toString(),
          datePublished: post.createdAt.toString(),
          description: post.summary ?? undefined,
          headline: post.title,
          image: post.coverFileId ? Storage.getPublicUrl(post.coverFileId) : undefined,
          author: user
            ? {
                '@type': 'Person',
                email: user.email,
                name: user.name
              }
            : undefined,
          mainEntityOfPage: {
            '@id': `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${idOrSlug}`,
            '@type': 'WebPage'
          }
        }}
      />
      <Style>{`html { scroll-padding-top: 60px }`}</Style>

      <DisplayByConditional condition={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.HEADER) === POST_CARD_VISIBILITY_MASK.HEADER}>
        <Card aria-label="post abstract" className="relative space-y-2 p-3 md:p-5" data-slot="post-abstract">
          <DisplayByAuth role="admin">
            <ButtonLink
              className="absolute top-3 right-3 md:top-5 md:right-5"
              href={`/dashboard/posts/${post.id}`}
              size="icon"
              target="_blank"
              variant="ghost"
            >
              <PencilLineIcon />
            </ButtonLink>
          </DisplayByAuth>
          <h1 className="font-heading text-2xl font-normal md:text-3xl">{post.title}</h1>
          {post.summary && <p className="text-secondary-foreground">{post.summary}</p>}
          <PostInfo defaultValue={post} id={post.id} />
        </Card>
      </DisplayByConditional>

      {post.content && (
        <div className="flex gap-bp-2">
          <div className="grid w-full gap-bp-4">
            <Card
              aria-label="post content"
              className="group/article relative overflow-hidden px-3 py-5 md:px-5 md:py-8"
              data-slot="post-content"
              id={ATTRIBUTE.ID.POST_CONTAINER}
            >
              <PostResizeButton
                className={cn(
                  'opacity-0 group-hover/article:opacity-100',
                  'absolute inset-e-1 top-1 z-10 inline-flex',
                  'aria-pressed:fixed aria-pressed:inset-e-[calc(var(--scrollbar-width,0)+(--spacing(1)))]'
                )}
                tabIndex={-1}
              />
              <article
                dangerouslySetInnerHTML={{
                  __html: post.content
                }}
                className="tiptap font-article"
              />
            </Card>

            <DisplayByConditional condition={!!prev || !!next}>
              <div className="grid gap-bp-2 sm:grid-cols-2">
                {prev && (
                  <Card
                    className="not-hover:bg-transparent"
                    render={
                      <Item aria-label="previous post" render={<Link href={`/posts/${prev.slug ?? prev.id}`} />}>
                        <ItemContent>
                          <ItemDescription>上一页</ItemDescription>
                          <ItemTitle>{prev.title}</ItemTitle>
                        </ItemContent>
                      </Item>
                    }
                  />
                )}
                {next && (
                  <Card
                    className="not-hover:bg-transparent"
                    render={
                      <Item aria-label="next post" className="sm:col-start-2" render={<Link href={`/posts/${next.slug ?? next.id}`} />}>
                        <ItemContent className="items-end">
                          <ItemDescription>下一页</ItemDescription>
                          <ItemTitle>{next.title}</ItemTitle>
                        </ItemContent>
                      </Item>
                    }
                  />
                )}
              </div>
            </DisplayByConditional>
          </div>

          {/* <DisplayByConditional condition={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.TOC) === POST_CARD_VISIBILITY_MASK.TOC}>
            <Card
              aria-label="post toc"
              data-slot="post-toc"
              render={
                <PostToc>
                  <MDXHeading component={PostTocHeading} source={post.content} />
                </PostToc>
              }
            />
          </DisplayByConditional> */}
        </div>
      )}
    </>
  )
}
