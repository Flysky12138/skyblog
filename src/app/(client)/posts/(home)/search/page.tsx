import { getPosts, PostList, PostSearchParams } from '../_components/post/post-list'

interface PageProps extends DynamicRouteProps<{}, PostSearchParams & { page: string }> {}

export default async function Page({ searchParams }: PageProps) {
  const { categories, page, tags } = await searchParams

  const pageNumber = Number.parseInt(page || '1')

  const { result: posts, ...pagination } = await getPosts(pageNumber, {
    categories: categories ? { some: { name: decodeURIComponent(categories) } } : undefined,
    tags: tags ? { some: { name: decodeURIComponent(tags) } } : undefined
  })

  return <PostList pagination={pagination} posts={posts} />
}
