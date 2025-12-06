'use cache'

import { PencilLine } from 'lucide-react'
import { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogPosting } from 'schema-dts'

import { DisplayByAuth } from '@/components/display/display-by-auth'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { JsonLD } from '@/components/json-ld'
import { MDXPickHeading } from '@/components/mdx/pick-heading'
import { MDXServer } from '@/components/mdx/server'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Style } from '@/components/utils/style'
import { ATTRIBUTE, CACHE_TAG, POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { cn } from '@/lib/utils'

import { getPosts } from '../utils'
import { PostInfo } from './_components/post-info'
import { PostResizeButton } from './_components/post-resize-button'
import { PostToc, PostTocHeading } from './_components/post-toc'
import { getPost, getPostsRecommendByPostId } from './utils'

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

  const { next, prev } = await getPostsRecommendByPostId(post.id)

  return (
    <>
      <JsonLD<BlogPosting>
        json={{
          '@type': 'BlogPosting',
          dateModified: post.updatedAt as unknown as string,
          datePublished: post.createdAt as unknown as string,
          description: post.summary ?? undefined,
          headline: post.title,
          image: post.cover ?? undefined,
          author: {
            '@type': 'Person',
            email: user?.email,
            name: user?.name
          },
          mainEntityOfPage: {
            '@id': `${process.env.NEXT_PUBLIC_WEBSITE_URL}/posts/${idOrSlug}`,
            '@type': 'WebPage'
          }
        }}
      />
      <Style>{`html { scroll-padding-top: 60px }`}</Style>

      <DisplayByConditional condition={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.HEADER) == POST_CARD_VISIBILITY_MASK.HEADER}>
        <Card aria-label="post abstract" className="relative flex flex-col gap-2 p-3 md:p-5" data-slot="post-abstract">
          <DisplayByAuth role="admin">
            <Button asChild className="absolute top-3 right-3 md:top-5 md:right-5" size="icon" variant="ghost">
              <Link href={`/dashboard/posts/${post.id}`} target="_blank">
                <PencilLine />
              </Link>
            </Button>
          </DisplayByAuth>
          <h1 className="font-title text-2xl font-normal md:text-3xl">{post.title}</h1>
          {post.summary && <p className="text-secondary-foreground">{post.summary}</p>}
          <PostInfo defaultValue={post} id={post.id} />
        </Card>
      </DisplayByConditional>

      {post.content && (
        <div className="gap-card-small flex">
          <div className="gap-card-large grid w-full">
            <Card asChild aria-label="post content">
              <article className="group/article relative max-w-none px-3 py-5 md:px-5" id={ATTRIBUTE.ID.POST_CONTAINER}>
                <PostResizeButton
                  className={cn(
                    'opacity-0 group-hover/article:opacity-100',
                    'absolute top-1 right-1 z-10 inline-flex [&+*]:mt-0',
                    'aria-pressed:fixed aria-pressed:right-[calc(var(--scrollbar-width)+--spacing(1))]'
                  )}
                />
                <MDXServer source={post.content} />
              </article>
            </Card>

            <DisplayByConditional condition={!!prev || !!next}>
              <div className="gap-card-small grid sm:grid-cols-2">
                {prev && (
                  <Card asChild aria-label="previous post">
                    <Item asChild variant="muted">
                      <Link href={`/posts/${prev.slug ?? prev.id}`}>
                        <ItemContent>
                          <ItemDescription>上一页</ItemDescription>
                          <ItemTitle>{prev.title}</ItemTitle>
                        </ItemContent>
                      </Link>
                    </Item>
                  </Card>
                )}
                {next && (
                  <Card asChild aria-label="next post" className="sm:col-start-2">
                    <Item asChild variant="muted">
                      <Link href={`/posts/${next.slug ?? next.id}`}>
                        <ItemContent className="items-end">
                          <ItemDescription>下一页</ItemDescription>
                          <ItemTitle>{next.title}</ItemTitle>
                        </ItemContent>
                      </Link>
                    </Item>
                  </Card>
                )}
              </div>
            </DisplayByConditional>
          </div>

          <DisplayByConditional condition={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.TOC) == POST_CARD_VISIBILITY_MASK.TOC}>
            <Card asChild aria-label="post toc">
              <PostToc>
                <MDXPickHeading headingComponent={PostTocHeading} source={post.content} />
              </PostToc>
            </Card>
          </DisplayByConditional>
        </div>
      )}
    </>
  )
}
