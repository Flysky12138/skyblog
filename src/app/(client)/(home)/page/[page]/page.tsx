'use cache'

import { cacheLife, cacheTag } from 'next/cache'

import { CacheTag } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

import { getPosts, POST_WHERE_INPUT } from '../../../utils'
import { PostList } from '../../_components/post-list'
import { PostListPagination } from '../../_components/post-list-pagination'

export const generateStaticParams = async (): Promise<Awaited<PageProps<'/page/[page]'>['params']>[]> => {
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

export default async function Page({ params }: PageProps<'/page/[page]'>) {
  cacheLife('max')
  cacheTag(CacheTag.POSTS)

  const { page } = await params

  const pageNumber = Number.parseInt(page)

  const { count, result, totalPages } = await getPosts(pageNumber)

  return (
    <>
      <PostList count={count} posts={result} />
      <PostListPagination page={pageNumber} path="/page/[page]" totalPages={totalPages} />
    </>
  )
}
