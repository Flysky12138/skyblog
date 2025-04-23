'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { isUndefined } from 'es-toolkit'
import { Archive, House, LibraryBig, LucideIcon, NotebookPen, Plus, Settings, Share2, User, UserRoundSearch, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Menu {
  group: {
    action?: {
      href: StartsWith<'/'>
      icon: LucideIcon
    }
    href: StartsWith<'/'>
    icon: LucideIcon
    name: string
    onlyShow?: 'close' | 'open'
  }[]
  label: string
}

const menus: Menu[] = [
  {
    group: [
      { href: '/dashboard', icon: House, name: '面板' },
      {
        action: {
          href: '/dashboard/posts/new',
          icon: Plus
        },
        href: '/dashboard/posts',
        icon: LibraryBig,
        name: '文章'
      },
      { href: '/dashboard/posts/new', icon: NotebookPen, name: '新建文章', onlyShow: 'close' },
      { href: '/dashboard/r2', icon: Archive, name: '仓库' }
    ],
    label: 'Post'
  },
  {
    group: [
      { href: '/dashboard/user/members', icon: User, name: '成员' },
      { href: '/dashboard/user/visitors', icon: UserRoundSearch, name: '访客' },
      { href: '/dashboard/user/friends', icon: Users, name: '友链' }
    ],
    label: 'User'
  },
  {
    group: [
      { href: '/dashboard/clash', icon: Share2, name: 'Clash 共享' },
      { href: '/dashboard/setting', icon: Settings, name: '设置' }
    ],
    label: 'Other'
  }
]

export const NavMain = () => {
  const pathname = usePathname()
  const { open } = useSidebar()

  return menus.map((menu, index) => (
    <SidebarGroup key={index}>
      <SidebarGroupLabel>{menu.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menu.group.map(item => (
            <SidebarMenuItem
              key={item.href}
              className={cn({
                hidden: !(isUndefined(item.onlyShow) || (item.onlyShow == 'open' && open) || (item.onlyShow == 'close' && !open))
              })}
            >
              <SidebarMenuButton asChild isActive={item.href == pathname} tooltip={item.name}>
                <Link href={item.href}>
                  <item.icon /> {item.name}
                </Link>
              </SidebarMenuButton>
              {item.action && (
                <SidebarMenuAction asChild>
                  <Link href={item.action.href}>
                    <item.action.icon />
                  </Link>
                </SidebarMenuAction>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ))
}
