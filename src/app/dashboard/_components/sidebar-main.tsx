'use client'

import { isUndefined } from 'es-toolkit'
import {
  ArchiveIcon,
  HeartHandshakeIcon,
  HouseIcon,
  LibraryBigIcon,
  NotebookPenIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  UserRoundSearchIcon,
  WebhookIcon
} from 'lucide-react'
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
import { STORAGE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Menu {
  label: string
  group: {
    href: StartsWith<'/'>
    icon: React.ReactElement
    name: string
    onlyShow?: 'collapsed' | 'expanded'
    action?: {
      href: StartsWith<'/'>
      icon: React.ReactElement
    }
  }[]
}

const menus: Menu[] = [
  {
    label: 'Post',
    group: [
      { href: '/dashboard', icon: <HouseIcon />, name: '面板' },
      {
        href: '/dashboard/posts',
        icon: <LibraryBigIcon />,
        name: '文章',
        action: {
          href: '/dashboard/posts/create',
          icon: <PlusIcon />
        }
      },
      { href: '/dashboard/posts/create', icon: <NotebookPenIcon />, name: '新建文章', onlyShow: 'collapsed' },
      { href: `/dashboard/storage?id=${STORAGE.ROOT_DIRECTORY_ID}`, icon: <ArchiveIcon />, name: '仓库' }
    ]
  },
  {
    label: 'User',
    group: [
      { href: '/dashboard/users/members', icon: <UserIcon />, name: '成员' },
      { href: '/dashboard/users/visits', icon: <UserRoundSearchIcon />, name: '访客' },
      { href: '/dashboard/friends', icon: <HeartHandshakeIcon />, name: '友链' }
    ]
  },
  {
    label: 'Other',
    group: [
      { href: '/dashboard/clashes', icon: <Clash />, name: 'Clash' },
      { href: '/dashboard/crons', icon: <WebhookIcon />, name: 'Cron' },
      { href: '/dashboard/setting', icon: <SettingsIcon />, name: '设置' }
    ]
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
