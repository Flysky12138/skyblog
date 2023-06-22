/**
 * 过滤数组
 * @param array 目标数组
 * @param predicate 回调函数，返回 `true` 保留当前值
 */
export const removeDuplicates = <T>(array: T[], predicate: (a: T[], b: T) => boolean) => {
  return array.reduce<T[]>((pre, cur) => {
    if (predicate(pre, cur)) pre.push(cur)
    return pre
  }, [])
}
