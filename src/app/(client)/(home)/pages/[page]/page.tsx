import { prisma } from '@/lib/prisma'

import { getPosts, POST_WHERE_INPUT, PostList } from '../../_components/post/post-list'

interface PageProps extends DynamicRouteProps<{ page: string }> {}

export const generateStaticParams = async (): Promise<Awaited<PageProps['params']>[]> => {
  const posts = await prisma.post.paginate(
    { where: POST_WHERE_INPUT },
    {
      limit: Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT)
    }
  )
  return Array.from({ length: posts.totalPages }, (_, index) => ({
    page: String(index + 1)
  }))
}

export default async function Page({ params }: PageProps) {
  const { page } = await params

  const pageNumber = Number.parseInt(page)

  const { result: posts, ...pagination } = await getPosts(pageNumber)

  return <PostList path="/pages/[page]" posts={posts} {...pagination} />
}
