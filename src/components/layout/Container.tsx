import { cn } from '@/lib/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  variant?: 'header'
}

export default function Container({ children, className, variant }: ContainerProps) {
  return (
    <section
      className={cn(
        'mx-auto max-w-screen-xl px-4 sm:px-6 xl:px-16',
        {
          'max-w-screen-2xl px-8 sm:px-10 xl:px-20': variant == 'header'
        },
        className
      )}
    >
      {children}
    </section>
  )
}
