import Icon from '@/app/icon.svg'
import { Logo } from '@/components/layout/logo'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import Link from 'next/link'

export const NavLogo = () => {
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
