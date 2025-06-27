'use client'

import { breakpoints, useBreakpoint } from '@/hooks/use-breakpoint'

import { DisplayByConditional, DisplayByConditionalProps } from './display-by-conditional'

interface DisplayByBreakPointProps extends Omit<DisplayByConditionalProps, 'condition'> {
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

export const DisplayByBreakPoint = ({ max: up = Infinity, min: down = -Infinity, ...props }: DisplayByBreakPointProps) => {
  const breakpoint = useBreakpoint()
  const breakpointMatchedValue = breakpoints[breakpoint]

  const maxValue = typeof up == 'string' ? breakpoints[up] : up
  const downValue = typeof down == 'string' ? breakpoints[down] : down

  const isLtMaxValue = breakpointMatchedValue < maxValue
  const isGteMinValue = breakpointMatchedValue >= downValue

  return <DisplayByConditional condition={isGteMinValue && isLtMaxValue} {...props} />
}
