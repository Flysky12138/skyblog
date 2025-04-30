'use client'

import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { useIsClient } from '@/hooks/use-is-client'
import { useTheme } from '@/hooks/use-theme'
import { MoonStar, Sun } from 'lucide-react'

export const NavTheme = () => {
  const { isDark, toggleTheme } = useTheme()

  const isClient = useIsClient()
  if (!isClient) return <div className="skeleton h-8 rounded-md" />

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
