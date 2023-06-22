import Card from '@/components/layout/Card'
import { MDXServer, MDXToc } from '@/components/mdx'
import { SELECTOR } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Typography } from '@mui/joy'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Edit from './_/Edit'
import Issues from './_/Issues'
import LocateToc from './_/LocateToc'
import PostInfo from './_/PostInfo'

const getPost = async (id: string) => {
  return await prisma.post.findUnique({
    include: { author: true, categories: true, tags: true },
    where: { id }
  })
}

interface PageProps extends DynamicRoute<{ id: string }> {}

export const dynamicParams = false
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
        <Card className="flex flex-col gap-y-2 p-5">
          <Edit className="absolute right-5 top-5" id={post.id} />
          <Typography className="font-title font-normal" component="h1" level="h2">
            {post.title}
          </Typography>
          <Typography level="body-md">{post.description}</Typography>
          <PostInfo id={post.id} />
        </Card>
      )}
      {post.content ? (
        <section className="flex gap-x-4">
          <style>{`html { scroll-padding-top: 60px }`}</style>
          <Card className="max-w-none grow" component="article">
            <MDXServer value={post.content} />
          </Card>
          <Card
            className="s-hidden-scrollbar sticky top-[calc(theme(height.header)+theme(height.9))] hidden max-h-[calc(100dvh-theme(height.header)-2*theme(height.9))] w-52 shrink-0 space-y-1.5 self-start overflow-auto p-3 pr-1.5 empty:hidden lg:block"
            id={SELECTOR.IDS.TOC}
          >
            <LocateToc />
            <MDXToc value={post.content} />
          </Card>
        </section>
      ) : null}
      <Issues />
    </section>
  )
}
