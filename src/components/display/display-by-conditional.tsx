export interface DisplayByConditionalProps extends React.PropsWithChildren {
  /**
   * @default false
   */
  condition?: boolean
  /**
   * 未满足条件时显示的内容
   * @default null
   */
  fallback?: React.ReactNode
}

export function DisplayByConditional({ children, condition = false, fallback = null }: DisplayByConditionalProps) {
  return condition ? children : fallback
}
