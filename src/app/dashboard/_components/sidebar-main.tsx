'use client'

import { isUndefined } from 'es-toolkit'
import { Archive, House, LibraryBig, NotebookPen, Plus, Settings, User, UserRoundSearch, Users } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import Clash from '@/assets/svg/clash.svg'
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

interface Menu {
  group: {
    action?: {
      href: StartsWith<'/'>
      icon: React.ReactElement
    }
    href: StartsWith<'/'>
    icon: React.ReactElement
    name: string
    onlyShow?: 'collapsed' | 'expanded'
  }[]
  label: string
}

const menus: Menu[] = [
  {
    group: [
      { href: '/dashboard', icon: <House />, name: '面板' },
      {
        action: {
          href: '/dashboard/posts/new',
          icon: <Plus />
        },
        href: '/dashboard/posts',
        icon: <LibraryBig />,
        name: '文章'
      },
      { href: '/dashboard/posts/new', icon: <NotebookPen />, name: '新建文章', onlyShow: 'collapsed' },
      { href: '/dashboard/r2', icon: <Archive />, name: '仓库' }
    ],
    label: 'Post'
  },
  {
    group: [
      { href: '/dashboard/user/members', icon: <User />, name: '成员' },
      { href: '/dashboard/user/visitors', icon: <UserRoundSearch />, name: '访客' },
      { href: '/dashboard/user/friends', icon: <Users />, name: '友链' }
    ],
    label: 'User'
  },
  {
    group: [
      { href: '/dashboard/clash', icon: <Clash />, name: 'Clash 共享' },
      { href: '/dashboard/setting', icon: <Settings />, name: '设置' }
    ],
    label: 'Other'
  }
]

export const SidebarMain = () => {
  const pathname = usePathname()
  const { open, setOpenMobile } = useSidebar()

  const handleCloseSidebarMobile = React.useEffectEvent(() => {
    setOpenMobile(false)
  })

  return menus.map((menu, index) => (
    <SidebarGroup key={index}>
      <SidebarGroupLabel>{menu.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menu.group.map(item => (
            <SidebarMenuItem
              key={item.href}
              className={cn({
                hidden: !isUndefined(item.onlyShow) && { collapsed: true, expanded: false }[item.onlyShow] == open
              })}
            >
              <SidebarMenuButton asChild isActive={item.href == pathname} tooltip={item.name}>
                <Link href={item.href as Route} onNavigate={handleCloseSidebarMobile}>
                  {item.icon} {item.name}
                </Link>
              </SidebarMenuButton>
              {item.action && (
                <SidebarMenuAction asChild>
                  <Link href={item.action.href as Route} onNavigate={handleCloseSidebarMobile}>
                    {item.action.icon}
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
