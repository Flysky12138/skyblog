import { createBreakpoint } from 'react-use'

/**
 * 和 tailwindcss 一样的断点
 */
export const breakpoints = {
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
  lg: 1024,
  md: 768,
  sm: 640,
  xl: 1280,
  xs: 320
} as const

/**
 * ```json
 * {
 *   xs: 320,
 *   sm: 640,
 *   md: 768,
 *   lg: 1024,
 *   xl: 1280,
 *   '2xl': 1536,
 *   '3xl': 1920,
 *   '4xl': 2560,
 * }
 * ```
 * if `window.innerWidth` is `700`, return `sm`
 */
export const useBreakpoint = createBreakpoint(breakpoints) as () => keyof typeof breakpoints
