export const removeDuplicates = <T>(array: T[], predicate: (a: T[], b: T) => boolean) => {
  return array.reduce<T[]>((pre, cur) => {
    if (predicate(pre, cur)) pre.push(cur)
    return pre
  }, [])
}
