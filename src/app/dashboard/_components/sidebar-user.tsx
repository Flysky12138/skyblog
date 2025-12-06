'use client'

import { ChevronsUpDown, LogOut, UserRoundCog } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'

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
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
              tooltip={name}
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage alt={name} crossOrigin="anonymous" decoding="async" loading="lazy" src={src} />
                <AvatarFallback className="rounded-lg">{name.slice(0, 3)}</AvatarFallback>
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
                  <AvatarImage alt={name} crossOrigin="anonymous" decoding="async" loading="lazy" src={src} />
                  <AvatarFallback className="rounded-lg">{name}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="text-muted-foreground truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account/settings">
                <UserRoundCog /> 个人资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive! cursor-pointer"
              onClick={async () => {
                await authClient.signOut()
                router.replace('/auth/sign-in')
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
