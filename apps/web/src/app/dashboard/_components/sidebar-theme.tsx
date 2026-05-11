'use client'

import { DropdownMenuThemeRadio } from '@repo/ui/components-self/theme'
import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@repo/ui/components/sidebar'
import { Skeleton } from '@repo/ui/components/skeleton'
import { Switch } from '@repo/ui/components/switch'
import { useTheme } from '@repo/ui/hooks/use-theme'

export function SidebarTheme() {
  const { isDark, ThemeIcon } = useTheme()

  return (
    <SidebarMenu>
      <DropdownMenuThemeRadio
        nativeButton={false}
        render={
          <SidebarMenuItem tabIndex={-1}>
            <SidebarMenuButton tooltip="深色模式">
              <ThemeIcon /> 深色模式
            </SidebarMenuButton>
            <SidebarMenuAction className="pointer-events-none mr-2" tabIndex={-1}>
              <Switch checked={isDark} tabIndex={-1} />
            </SidebarMenuAction>
          </SidebarMenuItem>
        }
        skeleton={<Skeleton className="h-8" />}
      />
    </SidebarMenu>
  )
}
