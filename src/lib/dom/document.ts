import 'client-only'

/** 获取标签到页面顶部的距离 */
export const getElementDistanceFromTop = (element: HTMLElement | null): number => {
  if (!element) return 0
  return element.offsetTop + getElementDistanceFromTop(element.offsetParent as HTMLElement)
}
