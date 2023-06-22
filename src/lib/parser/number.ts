/**
 * 判断 `target` 是否属于区间 `[min,max]`
 */
export const isBetween = (target: number, min: number, max: number) => {
  if (min <= target && target <= max) return true
  return false
}
