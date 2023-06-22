'use client'

import { breakpoints, useBreakpoint } from '@/hooks/use-breakpoint'

import { DisplayByConditional, DisplayByConditionalProps } from './display-by-conditional'

export interface DisplayByBreakPointProps extends Omit<DisplayByConditionalProps, 'condition'> {
  /**
   * 最大宽度
   * @default Infinity
   */
  max?: keyof typeof breakpoints | number
  /**
   * 最小宽度
   * @default -Infinity
   */
  min?: Exclude<keyof typeof breakpoints, 'xs'> | number
}

export function DisplayByBreakPoint({ max: up = Infinity, min: down = -Infinity, ...props }: DisplayByBreakPointProps) {
  const breakpoint = useBreakpoint()
  const breakpointMatchedValue = breakpoints[breakpoint]

  const upValue = typeof up == 'string' ? breakpoints[up] : up
  const downValue = typeof down == 'string' ? breakpoints[down] : down

  const isLtUpValue = breakpointMatchedValue < upValue
  const isGteDownValue = breakpointMatchedValue >= downValue

  const isMatched = isLtUpValue && isGteDownValue

  return <DisplayByConditional condition={isMatched} {...props} />
}
