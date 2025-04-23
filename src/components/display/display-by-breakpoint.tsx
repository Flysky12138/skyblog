'use client'

import { breakpoints, useBreakpoint } from '@/hooks/use-breakpoint'

import { DisplayByConditional, DisplayByConditionalProps } from './display-by-conditional'

interface DisplayByBreakPointProps extends Omit<DisplayByConditionalProps, 'condition'> {
  /**
   * `>=` 最小宽度
   * @default -Infinity
   */
  down?: Exclude<keyof typeof breakpoints, 'xs'> | number
  /**
   * `<` 最大宽度
   * @default Infinity
   */
  up?: keyof typeof breakpoints | number
}

export const DisplayByBreakPoint = ({ down = -Infinity, up = Infinity, ...props }: DisplayByBreakPointProps) => {
  const breakpoint = useBreakpoint()
  const breakpointMatchedValue = breakpoints[breakpoint]

  const upValue = typeof up == 'string' ? breakpoints[up] : up
  const downValue = typeof down == 'string' ? breakpoints[down] : down

  const isLtUpValue = breakpointMatchedValue < upValue
  const isGteDownValue = breakpointMatchedValue >= downValue

  return <DisplayByConditional condition={isGteDownValue && isLtUpValue} {...props} />
}
