import { cn } from '@/lib/cn'
import { Table as JoyTable, Sheet } from '@mui/joy'
import Card from '../layout/Card'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export default function Table({ children, className }: TableProps) {
  return (
    <Card className={cn('overflow-hidden rounded-md [&_th]:s-bg-title', className)}>
      <Sheet className="s-bg-content s-table-scrollbar h-full overflow-auto">
        <JoyTable stickyFooter stickyHeader>
          {children}
        </JoyTable>
      </Sheet>
    </Card>
  )
}
