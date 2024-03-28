import { cn } from '@/lib/cn'

interface TableWrapperProps {
  children: React.ReactNode
  className?: string
  slotProps?: {
    wrap?: {
      className?: string
    }
  }
}

export default function TableWrapper({ children, className, slotProps }: TableWrapperProps) {
  return (
    <section className={cn('s-bg-card s-border-color-card overflow-hidden rounded-md border', '[&_th]:bg-[#eef1f6] [&_th]:dark:bg-[#292d38]', className)}>
      <div className={cn('s-table-scrollbar h-full overflow-auto', slotProps?.wrap?.className)}>{children}</div>
    </section>
  )
}
