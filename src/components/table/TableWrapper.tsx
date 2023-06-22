import { cn } from '@/lib/cn'
import { Sheet } from '@mui/joy'
import Card from '../layout/Card'

interface TableWrapperProps {
  children: React.ReactNode
  className?: string
  slotProps?: {
    sheet?: {
      className?: string
    }
  }
}

export default function TableWrapper({ children, className, slotProps }: TableWrapperProps) {
  return (
    <Card className={cn('overflow-hidden rounded-md [&_th]:s-bg-title', className)}>
      <Sheet className={cn('s-bg-content s-table-scrollbar h-full overflow-auto', slotProps?.sheet?.className)}>{children}</Sheet>
    </Card>
  )
}
