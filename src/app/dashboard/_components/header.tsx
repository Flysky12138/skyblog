import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('border-divide h-header flex items-center border-b px-4', className)}>
      <SidebarTrigger className="size-9" variant="outline" />
    </header>
  )
}
