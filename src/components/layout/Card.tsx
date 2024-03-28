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
        's-bg-card s-border-color-card rounded-lg border backdrop-blur',
        {
          'p-5 pt-7': title
        },
        className
      )}
      {...props}
    >
      {children}
      {title && (
        <p className="s-subtitle absolute left-3 top-0 m-0 -translate-y-1/2 rounded border border-inherit bg-slate-200 px-1 py-px dark:bg-zinc-900">{title}</p>
      )}
    </Component>
  )
})
