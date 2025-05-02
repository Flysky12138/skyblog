'use client'

import { useIsClient } from '@/hooks/use-is-client'
import { useTheme } from '@/hooks/use-theme'
import { MoonStar, Sun } from 'lucide-react'
import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from 'ui/sidebar'
import { Switch } from 'ui/switch'

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
