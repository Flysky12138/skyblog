import { cn } from '@/lib/cn'
import { Sheet } from '@mui/joy'
import Card from '../layout/Card'

interface TableWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function TableWrapper({ children, className }: TableWrapperProps) {
  return (
    <Card className={cn('overflow-hidden rounded-md [&_th]:s-bg-title', className)}>
      <Sheet className="s-bg-content s-table-scrollbar h-full overflow-auto">{children}</Sheet>
    </Card>
  )
}
