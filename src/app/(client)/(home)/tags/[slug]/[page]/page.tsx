import Pagination from '../../../_/Pagination'
import Posts from '../../../_/Posts'
import { getPosts } from '../../../_/fetch'

type PagePropsType = DynamicRouteType<{ page: string; slug: string }>

export default async function Page({ params }: PagePropsType) {
  const page = Number.parseInt(params.page)
  const posts = await getPosts(page, {
    tags: {
      some: {
        name: decodeURIComponent(params.slug)
      }
    }
  })

  return (
    <Posts posts={posts}>
      <Pagination count={Math.ceil(posts.pagination.total / posts.pagination.take)} page={page} pathname={`/tags/${params.slug}/`} />
    </Posts>
  )
}
