export interface DisplayByConditionalProps extends React.PropsWithChildren {
  /**
   * @default false
   */
  condition?: boolean
  /**
   * 未满足条件时显示的内容
   */
  fallback?: React.ReactNode
}

export const DisplayByConditional = ({ condition = false, children, fallback }: DisplayByConditionalProps) => {
  return condition ? children : fallback
}
