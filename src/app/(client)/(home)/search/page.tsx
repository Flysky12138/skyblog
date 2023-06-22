import { getPosts } from '../../utils'
import { PostList, PostSearchParams } from '../_components/post-list'

export default async function Page({ searchParams }: PageProps<'/search'>) {
  const { categories, page, tags } = (await searchParams) as PostSearchParams & { page: string }

  const pageNumber = Number.parseInt(page || '1')

  const { result: posts, ...pagination } = await getPosts(pageNumber, {
    categories: categories ? { some: { name: decodeURIComponent(categories) } } : undefined,
    tags: tags ? { some: { name: decodeURIComponent(tags) } } : undefined
  })

  return <PostList pagination={pagination} posts={posts} />
}
