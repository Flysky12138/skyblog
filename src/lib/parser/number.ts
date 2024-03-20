export const isBetween = (target: number, min: number, max: number) => {
  if (min <= target && target <= max) return true
  return false
}
