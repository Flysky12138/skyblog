import { buttonVariants } from '../components/button'
import * as ButtonPrimitive from '../components/button'
import { Spinner } from '../components/spinner'

export { buttonVariants }

interface ButtonProps extends React.ComponentProps<typeof ButtonPrimitive.Button> {
  loading?: boolean
}

/**
 * 添加加载中状态
 */
export function Button({ children, disabled, loading, ...props }: ButtonProps) {
  const _disabled = disabled ?? loading

  return (
    <ButtonPrimitive.Button disabled={_disabled} {...props}>
      {loading ? <Spinner /> : children}
    </ButtonPrimitive.Button>
  )
}
