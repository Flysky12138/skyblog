import { cn } from '@/lib/cn'

interface TableWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function TableWrapper({ children, className }: TableWrapperProps) {
  return (
    <section className={cn('s-bg-card s-border-card max-h-full overflow-auto rounded-md border', '[&_th]:bg-[#eef1f6] [&_th]:dark:bg-[#292d38]', className)}>
      {children}
    </section>
  )
}
