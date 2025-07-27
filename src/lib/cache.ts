import { revalidatePath } from 'next/cache'

export const CacheClear = {
  friends: () => {
    revalidatePath('/friends')
  },
  post: (id?: string) => {
    if (id) {
      revalidatePath(`/posts/${id}`)
    }
    revalidatePath('/posts/page')
  }
}
