import { cn } from '@/lib/cn'
import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  component?: React.ElementType
  title?: string
}

export default React.forwardRef(function Card<T>(
  { children, className, component: Component = 'section', title, ...props }: CardProps & T,
  ref: React.Ref<HTMLElement | undefined>
) {
  return (
    <Component
      ref={ref}
      className={cn(
        'relative rounded-lg border border-transparent bg-white shadow dark:s-border-color-card dark:bg-zinc-700/30',
        {
          'p-5 pt-7': title
        },
        className
      )}
      {...props}
    >
      {children}
      {title && <p className="s-bg-root s-subtitle absolute left-3 top-0 m-0 -translate-y-1/2 rounded border border-inherit px-1 py-px">{title}</p>}
    </Component>
  )
})
