import Link from 'next/link'

import { cn } from '@/lib/utils'

import { buttonVariants } from '../ui/button'
import * as ButtonPrimitive from '../ui/button'
import { Spinner } from '../ui/spinner'

interface ButtonProps extends React.ComponentProps<typeof ButtonPrimitive.Button> {
  loading?: boolean
}

/**
 * 添加加载中状态
 */
export function Button({ children, disabled, loading, ...props }: ButtonProps) {
  const _disabled = disabled || loading

  return (
    <ButtonPrimitive.Button disabled={_disabled} focusableWhenDisabled={_disabled} {...props}>
      {loading ? <Spinner /> : children}
    </ButtonPrimitive.Button>
  )
}

/**
 * 添加 Link 按键
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
