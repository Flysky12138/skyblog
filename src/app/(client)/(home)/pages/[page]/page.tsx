import Pagination from '@/components/pagination/Pagination'
import prisma from '@/lib/prisma'
import PostLists, { getPosts, POST_WHERE_INPUT } from '../../_components/PostLists'

interface PageProps extends DynamicRoute<{ page: string }> {}

export const generateStaticParams = async (): Promise<PageProps['params'][]> => {
  const ans: PageProps['params'][] = []
  const take = Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT)

  const count = await prisma.post.count({ where: POST_WHERE_INPUT })
  for (let i = 1; i <= Math.ceil(count / take); i++) {
    ans.push({ page: i.toString() })
  }

  return ans
}

export default async function Page({ params }: PageProps) {
  const page = Number.parseInt(params.page)
  const posts = await getPosts(page)

  return (
    <PostLists posts={posts}>
      <Pagination className="mx-auto" count={Math.ceil(posts.pagination.total / posts.pagination.take)} page={page} path="/pages/[page]" />
    </PostLists>
  )
}
