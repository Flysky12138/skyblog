export interface ShowProps extends React.PropsWithChildren {
  /**
   * 未满足条件时显示的内容
   *
   * @default null
   */
  fallback?: React.ReactNode
  /**
   * @default false
   */
  when?: boolean
}

export function Show({ children, fallback = null, when = false }: ShowProps) {
  return when ? children : fallback
}
