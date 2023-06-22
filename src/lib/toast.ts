import { toast } from 'sonner'

export const Toast = async <T = unknown>(promise: Promise<T>, message?: React.ReactNode, description?: string): Promise<T> => {
  const id = toast.loading('Loading...', { description, duration: Infinity })
  try {
    const data = await promise
    message
      ? toast.success(message, {
          description,
          id,
          duration: 5000
        })
      : toast.dismiss(id)
    return data
  } catch (error) {
    toast.dismiss(id)
    return Promise.reject(error)
  }
}
