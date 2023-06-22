import { cn } from '@/lib/cn'
import Card from '../layout/Card'

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
    <Card className={cn('overflow-hidden rounded-md', '[&_th]:s-bg-title', className)}>
      <div className={cn('s-bg-content s-table-scrollbar h-full overflow-auto', slotProps?.wrap?.className)}>{children}</div>
    </Card>
  )
}
