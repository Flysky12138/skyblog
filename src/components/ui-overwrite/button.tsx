import { DisplayByConditional } from '../display/display-by-conditional'
import { Button as ShadcnButton } from '../ui/button'
import { Spinner } from '../ui/spinner'

interface LoadingButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  /** 按钮图标 */
  icon?: React.ReactNode
  loading?: boolean
}

/**
 * 添加加载中状态
 */
export function LoadingButton({ children, disabled, icon, loading, ...props }: LoadingButtonProps) {
  const _disabled = disabled || loading

  return (
    <ShadcnButton disabled={_disabled} {...props}>
      <DisplayByConditional condition={loading} fallback={icon}>
        <Spinner />
      </DisplayByConditional>
      {children}
    </ShadcnButton>
  )
}
