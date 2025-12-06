/**
 * 异步任务池
 * @param max 最大并行任务数
 * @default max = 3
 */
export const promiseAllSettledPool = async (promises: (() => Promise<unknown>)[], max = 3) => {
  return Promise.allSettled(
    Array.from({ length: max }).map(async () => {
      while (promises.length) {
        try {
          await promises.shift()?.()
        } catch (error) {
          console.error(error)
        }
      }
    })
  )
}

/**
 * 异步任务池
 * @param max 最大并行任务数
 * @default max = 3
 */
export const promiseAllPool = async (promises: (() => Promise<unknown>)[], max = 3) => {
  return Promise.all(
    Array.from({ length: max }).map(async () => {
      while (promises.length) {
        await promises.shift()?.()
      }
    })
  )
}
