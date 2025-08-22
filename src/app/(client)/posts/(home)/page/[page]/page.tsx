import { prisma } from '@/lib/prisma'

import { getPosts, POST_WHERE_INPUT } from '../../../utils'
import { PostList } from '../../_components/post/post-list'

export const generateStaticParams = async (): Promise<Awaited<PageProps<'/posts/page/[page]'>['params']>[]> => {
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

export default async function Page({ params }: PageProps<'/posts/page/[page]'>) {
  const { page } = await params

  const pageNumber = Number.parseInt(page)

  const { result: posts, ...pagination } = await getPosts(pageNumber)

  return (
    <PostList
      pagination={{
        ...pagination,
        path: '/posts/page/[page]'
      }}
      posts={posts}
    />
  )
}
