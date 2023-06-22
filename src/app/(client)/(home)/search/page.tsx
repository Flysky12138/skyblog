import PostList, { getPosts } from '../_components/PostList'

interface PageProps extends DynamicRoute<{}, { categories: string; page: string; tags: string }> {}

export default async function Page({ searchParams }: PageProps) {
  const page = Number.parseInt(searchParams.page || '1')

  const { categories, tags } = searchParams

  const posts = await getPosts(page, {
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

  return <PostList page={page} posts={posts} />
}
