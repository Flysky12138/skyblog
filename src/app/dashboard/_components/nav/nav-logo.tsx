import icon from '@/app/icon.svg'
import { Logo } from '@/components/layout/logo'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'

export const NavLogo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={process.env.NEXT_PUBLIC_TITLE}>
          <Link href="/">
            <Image priority alt="logo" className="size-5" src={icon}></Image>
            <Logo />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
