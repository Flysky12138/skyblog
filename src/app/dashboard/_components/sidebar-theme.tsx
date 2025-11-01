'use client'

import { MoonStar, Sun } from 'lucide-react'

import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useMounted } from '@/hooks/use-mounted'
import { useTheme } from '@/hooks/use-theme'

export const SidebarTheme = () => {
  const { isDark, toggleTheme } = useTheme()

  const isMounted = useMounted()
  if (!isMounted) return <Skeleton className="h-8" />

  return (
    <SidebarMenu>
      <SidebarMenuItem onClick={toggleTheme}>
        <SidebarMenuButton tooltip="深色模式">{isDark ? <MoonStar /> : <Sun />} 深色模式</SidebarMenuButton>
        <SidebarMenuAction asChild>
          <div className="pointer-events-none justify-end!">
            <Switch checked={isDark} />
          </div>
        </SidebarMenuAction>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
