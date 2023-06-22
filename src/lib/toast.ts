import { toast } from 'sonner'

export const CustomToast = async <T = any>(promise: Promise<T>, successMessage?: string, description?: string): Promise<T> => {
  const toastId = toast.loading('Loading...', { duration: Infinity })
  try {
    const data = await promise
    if (successMessage) {
      toast.success(successMessage, {
        description,
        id: toastId
      })
    }
    return data
  } catch (error) {
    return Promise.reject(error)
  } finally {
    setTimeout(() => {
      toast.dismiss(toastId)
    }, 4000)
  }
}
