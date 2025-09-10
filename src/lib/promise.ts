/**
 * 异步任务池
 * @param max 最大并行任务数
 * @default max = 3
 */
export const promisePool = async (promises: (() => Promise<any>)[], max = 3) => {
  return Promise.allSettled(
    Array.from({ length: max }).map(async () => {
      while (promises.length) {
        await promises.shift()?.()
      }
    })
  )
}
