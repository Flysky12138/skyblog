import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarRail } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'
import { NavLogo } from './nav-logo'
import { NavMain } from './nav-main'
import { NavTheme } from './nav-theme'
import { NavUser } from './nav-user'

export const Nav = async () => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value == 'true'

  return (
    <SidebarProvider
      className="w-auto"
      defaultOpen={defaultOpen}
      style={
        {
          '--sidebar-width': '14rem'
        } as React.CSSProperties
      }
    >
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
    </SidebarProvider>
  )
}
