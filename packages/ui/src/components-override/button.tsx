import Link from 'next/link'

import { buttonVariants } from '../components/button'
import * as ButtonPrimitive from '../components/button'
import { Spinner } from '../components/spinner'
import { cn } from '../lib/utils'

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

/**
 * 添加 Link 按键
 *
 * @see https://ui.shadcn.com/docs/components/base/button#as-link
 */
export function ButtonLink({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof ButtonPrimitive.Button> & React.ComponentProps<typeof Link>) {
  return <Link className={cn(buttonVariants({ size, variant }), className)} {...props} />
}
