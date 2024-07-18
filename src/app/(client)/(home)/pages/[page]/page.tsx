import prisma from '@/lib/prisma'
import PostList, { getPosts, POST_WHERE_INPUT } from '../../_components/PostList'

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

  return <PostList page={page} path="/pages/[page]" posts={posts} />
}
