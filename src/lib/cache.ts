import { revalidatePath } from 'next/cache'

export const CacheClear = {
  post: (id?: string) => {
    if (id) revalidatePath(`/posts/${id}`)
    revalidatePath('/pages')
  }
}
