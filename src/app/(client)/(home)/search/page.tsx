import { getPosts, PostList } from '../_components/post/post-list'

interface PageProps extends DynamicRouteProps<{}, { categories: string; page: string; tags: string }> {}

export default async function Page({ searchParams }: PageProps) {
  const { categories, page, tags } = await searchParams

  const pageNumber = Number.parseInt(page || '1')

  const { result: posts, ...pagination } = await getPosts(pageNumber, {
    categories: categories
      ? {
          some: {
            name: decodeURIComponent(categories)
          }
        }
      : undefined,
    tags: tags
      ? {
          some: {
            name: decodeURIComponent(tags)
          }
        }
      : undefined
  })

  return <PostList posts={posts} {...pagination} />
}
