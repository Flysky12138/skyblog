import { revalidatePath } from 'next/cache'

export const TAGS = {} as const

export const CacheClear = {
  music: () => revalidatePath('/api/music/neteasecloud/playlist'),
  post: (id: string) => {
    revalidatePath(`/posts/${id}`)
    Array.from(['categories', 'pages', 'tags']).forEach(slug => {
      revalidatePath(`/${slug}`)
    })
  }
}
