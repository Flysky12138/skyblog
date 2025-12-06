import { toast } from 'sonner'

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
 * 与 `toastPromise` 行为相同，但支持延迟显示提示；若 `promise` 在 `delay`(ms) 内完成，则不显示任何 toast。
 * @param delay 延迟时间，单位毫秒，默认 600ms
 */
export const toastPromiseDelay = async <T = unknown>(promise: Promise<T>, data?: PromiseData, delay = 600): Promise<T> => {
  let settled = false

  const tracked = promise.then(
    value => {
      settled = true
      return value
    },
    error => {
      settled = true
      throw error
    }
  )

  return new Promise<T>((resolve, reject) => {
    const onfulfilled = (value: T) => {
      clearTimeout(timer)
      resolve(value)
    }
    const onrejected = (error: unknown) => {
      clearTimeout(timer)
      reject(error)
    }

    const timer = setTimeout(() => {
      if (!settled) {
        toastPromise(tracked, data).then(onfulfilled, onrejected)
      } else {
        // 已经结束，直接返回结果
        tracked.then(onfulfilled, onrejected)
      }
    }, delay)

    // 如果在 delay 之前结束，清理 timer 并直接返回
    tracked.then(onfulfilled, onrejected)
  })
}
