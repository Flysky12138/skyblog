'use client'

import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/use-theme'
import { MoonStar, Sun } from 'lucide-react'

export const NavTheme = () => {
  const { toggleTheme, isDark } = useTheme()

  return (
    <SidebarMenu>
      <SidebarMenuItem onClick={toggleTheme}>
        <SidebarMenuButton tooltip="深色模式">{isDark ? <MoonStar /> : <Sun />} 深色模式</SidebarMenuButton>
        <SidebarMenuAction asChild>
          <div className="justify-end!">
            <Switch checked={isDark} />
          </div>
        </SidebarMenuAction>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
