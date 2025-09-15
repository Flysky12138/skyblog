import { cookies } from 'next/headers'
import React from 'react'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarRail } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import { NavLogo } from './nav-logo'
import { NavMain } from './nav-main'
import { NavTheme } from './nav-theme'
import { NavUser } from './nav-user'

export const Nav = () => {
  return (
    <Sidebar className="border-divide whitespace-nowrap" collapsible="icon">
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavTheme />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export const NavProvider = async ({ className, ...props }: React.ComponentProps<typeof SidebarProvider>) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.has('sidebar_state') ? cookieStore.get('sidebar_state')?.value == 'true' : true

  return <SidebarProvider className={cn('w-auto', className)} defaultOpen={defaultOpen} {...props} />
}
