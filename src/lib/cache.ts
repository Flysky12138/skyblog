import { revalidatePath } from 'next/cache'

export const CacheClear = {
  music: () => revalidatePath('/api/music/neteasecloud/playlist'),
  post: (id?: string) => {
    if (id) revalidatePath(`/posts/${id}`)
    revalidatePath('/pages')
  }
}
