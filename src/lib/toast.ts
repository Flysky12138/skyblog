import { toast } from 'sonner'

type PromiseData = Prettify<NonNullable<Parameters<typeof toast.promise>[1]>>

/**
 * 用于展示异步方法的状态
 */
export const Toast = async <T = unknown>(promise: Promise<T>, data?: PromiseData): Promise<T> => {
  return toast
    .promise(promise, {
      duration: 5000,
      loading: 'Loading...',
      ...data
    })
    .unwrap()
}
