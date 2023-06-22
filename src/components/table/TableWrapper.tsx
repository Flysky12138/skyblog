import { cn } from '@/lib/cn'
import Card from '../layout/Card'

interface TableWrapperPropsType {
  children: React.ReactNode
  className?: string
}

export default function TableWrapper({ children, className }: TableWrapperPropsType) {
  return <Card className={cn('max-h-full overflow-auto rounded-md bg-inherit', '[&_th]:bg-[#eef1f6] [&_th]:dark:bg-[#292d38]', className)}>{children}</Card>
}
