import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('border-divide border-b px-4 py-2', className)}>
      <SidebarTrigger variant="outline" />
    </header>
  )
}
