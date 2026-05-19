import { toast } from '@repo/ui/base'
import { toMerged } from 'es-toolkit'

type PromiseData = Prettify<Parameters<typeof toast.promise>[1]>

/**
 * 用于展示异步方法的状态
 */
export const toastPromise = async <T = unknown>(promise: Promise<T>, data?: PromiseData): Promise<T> => {
  return toast
    .promise(promise, {
      duration: 5000,
      loading: 'Loading...',
      ...data
    })
    .unwrap()
}

/**
 * 对 `toastPromise` 的封装；若 `promise` 在 `delay`(ms) 内完成，则显示除 loading 的其他状态。
 *
 * @param delay 延迟时间，单位毫秒，默认 600ms
 */
export const toastPromiseDelay = async <T = unknown>(promise: Promise<T>, data: PromiseData = {}, delay = 600): Promise<T> => {
  let displayed = false

  const tracked = promise.finally(() => {
    clearTimeout(timer)
    if (!displayed) {
      void toastPromise(tracked, toMerged(data, { loading: false } satisfies PromiseData))
    }
  })

  const timer = setTimeout(() => {
    displayed = true
    void toastPromise(tracked, data)
  }, delay)

  return tracked
}
