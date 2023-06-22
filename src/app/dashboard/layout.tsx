'use cache: private'

import { Metadata } from 'next'
import { cookies } from 'next/headers'
import React from 'react'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarRail } from '@/components/ui/sidebar'

import { Header } from './_components/header'
import { SidebarLogo } from './_components/sidebar-logo'
import { SidebarMain } from './_components/sidebar-main'
import { SidebarTheme } from './_components/sidebar-theme'
import { SidebarUser } from './_components/sidebar-user'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: 'Dashboard'
}

export default async function Layout({ children }: React.PropsWithChildren) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.has('sidebar_state') ? cookieStore.get('sidebar_state')?.value == 'true' : true

  return (
    <SidebarProvider className="w-auto" defaultOpen={defaultOpen}>
      <Sidebar className="border-divide whitespace-nowrap" collapsible="icon">
        <SidebarHeader>
          <SidebarLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMain />
        </SidebarContent>
        <SidebarFooter>
          <SidebarTheme />
          <SidebarUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <div className="flex flex-1 flex-col overflow-auto">
        <Header className="md:hidden" />
        <main className="bg-root flex-1 p-4 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}
