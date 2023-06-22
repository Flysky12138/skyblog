import Pagination from '@/components/pagination/Pagination'
import PostLists, { getPosts } from '../_components/PostLists'

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

  return (
    <PostLists posts={posts}>
      <Pagination className="mx-auto" count={Math.ceil(posts.pagination.total / posts.pagination.take)} page={page} />
    </PostLists>
  )
}
