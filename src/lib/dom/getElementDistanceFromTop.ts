'use client'

export const getElementDistanceFromTop = (element: HTMLElement | null): number => {
  if (!element) return 0
  return element.offsetTop + getElementDistanceFromTop(element.offsetParent as HTMLElement)
}
