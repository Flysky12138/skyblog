'use client'

import { ChevronsUpDown, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

export const SidebarUser = () => {
  const router = useRouter()
  const { isMobile, open } = useSidebar()
  const session = useSession()

  if (session.status == 'loading' || !session.data?.user) {
    return <Skeleton className={open ? 'h-12' : 'h-8'} />
  }

  const { email, image, name } = session.data.user

  const alt = name || undefined
  const src = image || undefined

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
              tooltip={alt}
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage alt={alt} crossOrigin="anonymous" decoding="async" loading="lazy" src={src} />
                <AvatarFallback className="rounded-lg">{name}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="text-muted-foreground truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage alt={alt} crossOrigin="anonymous" decoding="async" loading="lazy" src={src} />
                  <AvatarFallback className="rounded-lg">{name}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="text-muted-foreground truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive! cursor-pointer"
              onClick={async () => {
                await signOut()
                router.refresh()
              }}
            >
              <LogOut /> 注销
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
