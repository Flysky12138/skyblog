'use client'

import { breakpoints, useBreakpoint } from '@repo/react-hooks'

import { Show, ShowProps } from '.'

export interface ShowByBreakPointProps extends Omit<ShowProps, 'when'> {
  /**
   * 最大宽度
   *
   * @default Infinity
   */
  max?: keyof typeof breakpoints | number
  /**
   * 最小宽度
   *
   * @default -Infinity
   */
  min?: Exclude<keyof typeof breakpoints, 'xs'> | number
}

export function ShowByBreakPoint({ max: up = Infinity, min: down = -Infinity, ...props }: ShowByBreakPointProps) {
  const breakpoint = useBreakpoint()
  const breakpointMatchedValue = breakpoints[breakpoint]

  const upValue = typeof up === 'string' ? breakpoints[up] : up
  const downValue = typeof down === 'string' ? breakpoints[down] : down

  const isLtUpValue = breakpointMatchedValue < upValue
  const isGteDownValue = breakpointMatchedValue >= downValue

  const isMatched = isLtUpValue && isGteDownValue

  return <Show when={isMatched} {...props} />
}
