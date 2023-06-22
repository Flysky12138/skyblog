import Link from 'next/link'

import Icon from '@/app/icon.svg'
import { Logo } from '@/components/static/logo'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export const SidebarLogo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={process.env.NEXT_PUBLIC_TITLE}>
          <Link href="/">
            <Icon className="size-5" />
            <Logo />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
