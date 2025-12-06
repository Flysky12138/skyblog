import { Spinner } from '@/components/ui/spinner'

import { Button as ShadcnButton } from '../ui/button'

interface ButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  loading?: boolean
}

/**
 * 添加加载中状态
 */
export function Button({ children, disabled, loading, ...props }: ButtonProps) {
  const _disabled = disabled || loading

  return (
    <ShadcnButton disabled={_disabled} {...props}>
      {loading ? <Spinner /> : children}
    </ShadcnButton>
  )
}
