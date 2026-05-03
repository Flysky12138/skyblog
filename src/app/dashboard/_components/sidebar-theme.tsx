'use client'

import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/use-theme'
import { DropdownMenuRadioTheme } from '@/providers/theme'

export function SidebarTheme() {
  const { isDark, ThemeIcon } = useTheme()

  return (
    <SidebarMenu>
      <DropdownMenuRadioTheme
        nativeButton={false}
        render={
          <SidebarMenuItem tabIndex={-1}>
            <SidebarMenuButton tooltip="深色模式">
              <ThemeIcon /> 深色模式
            </SidebarMenuButton>
            <SidebarMenuAction className="mr-2" tabIndex={-1}>
              <Switch checked={isDark} tabIndex={-1} />
            </SidebarMenuAction>
          </SidebarMenuItem>
        }
        skeleton={<Skeleton className="h-8" />}
      />
    </SidebarMenu>
  )
}
