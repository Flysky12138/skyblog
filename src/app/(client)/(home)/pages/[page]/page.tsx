import prisma from '@/lib/prisma'
import Pagination from '../../_/Pagination'
import Posts from '../../_/Posts'
import { getPosts, where } from '../../_/fetch'

interface PageProps extends DynamicRoute<{ page: string }> {}

export const generateStaticParams = async (): Promise<Array<PageProps['params']>> => {
  const ans: PageProps['params'][] = []
  const take = Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT)

  const count = await prisma.post.count({ where })
  for (let i = 1; i <= Math.ceil(count / take); i++) {
    ans.push({ page: i.toString() })
  }

  return ans
}

export default async function Page({ params }: PageProps) {
  const page = Number.parseInt(params.page)
  const posts = await getPosts(page)

  return (
    <Posts posts={posts}>
      <Pagination count={Math.ceil(posts.pagination.total / posts.pagination.take)} page={page} pathname="/pages/" />
    </Posts>
  )
}
