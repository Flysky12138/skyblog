'use client'

import { ChevronsUpDownIcon, LogOutIcon, UserRoundCogIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth/client'

export function SidebarUser() {
  const router = useRouter()
  const { isMobile, open } = useSidebar()
  const { data: session, isPending } = authClient.useSession()

  if (isPending || !session) {
    return <Skeleton className={open ? 'h-12' : 'h-8'} />
  }

  const { email, image, name } = session.user
  const src = image || undefined

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
                tooltip={name}
              />
            }
          >
            <Avatar>
              <AvatarImage alt={name} crossOrigin="anonymous" decoding="async" loading="lazy" src={src} />
              <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{name}</span>
              <span className="text-muted-foreground truncate text-xs">{email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <div className="flex items-center gap-2 p-1">
                <Avatar>
                  <AvatarImage alt={name} crossOrigin="anonymous" decoding="async" loading="lazy" src={src} />
                  <AvatarFallback>{name.slice(0, 3)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="text-muted-foreground truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" render={<Link href="/account/settings" />}>
                <UserRoundCogIcon /> 个人资料
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                onClick={async () => {
                  await authClient.signOut()
                  router.replace('/auth/sign-in')
                }}
              >
                <LogOutIcon /> 注销
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
