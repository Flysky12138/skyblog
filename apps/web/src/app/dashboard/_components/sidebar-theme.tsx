'use client'

import { AnimatedIcon } from '@repo/components/theme'
import { useMounted } from '@repo/react-hooks'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@repo/ui/components/sidebar'
import { Skeleton } from '@repo/ui/components/skeleton'
import { useTheme } from '@repo/ui/hooks/use-theme'

export function SidebarTheme() {
  const isMounted = useMounted()
  const { ThemeIcon, themeText, toggleTheme } = useTheme()

  if (!isMounted) {
    return <Skeleton className="h-8" />
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem
        tabIndex={-1}
        onClick={() => {
          toggleTheme()
        }}
      >
        <SidebarMenuButton tooltip="主题">
          <AnimatedIcon className="shrink-0">
            <ThemeIcon />
          </AnimatedIcon>
          {themeText}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
