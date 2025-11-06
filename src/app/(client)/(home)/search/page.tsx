import { getPosts } from '../../utils'
import { PostList, PostSearchParams } from '../_components/post-list'
import { PostListPagination } from '../_components/post-list-pagination'

export default async function Page({ searchParams }: PageProps<'/search'>) {
  const { categories, page, tags } = (await searchParams) as PostSearchParams & { page: string }

  const pageNumber = Number.parseInt(page || '1')

  const { count, result, totalPages } = await getPosts(pageNumber, {
    categories: categories ? { some: { name: decodeURIComponent(categories) } } : undefined,
    tags: tags ? { some: { name: decodeURIComponent(tags) } } : undefined
  })

  return (
    <>
      <PostList count={count} posts={result} />
      <PostListPagination page={pageNumber} totalPages={totalPages} />
    </>
  )
}
