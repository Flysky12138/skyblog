import { SidebarTrigger } from '@repo/ui/components/sidebar'
import { cn } from '@repo/ui/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('flex h-header items-center border-b border-divide px-4', className)}>
      <SidebarTrigger className="size-9" variant="outline" />
    </header>
  )
}
