'use client'

import { LayoutDashboardIcon, LogInIcon, UserRoundCogIcon } from 'lucide-react'

import { ButtonLink } from '@/components/ui-overwrite/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { authClient } from '@/lib/auth/client'

export function AuthButton() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <Skeleton className="size-9" />

  if (!session) {
    return (
      <Tooltip>
        <TooltipTrigger render={<ButtonLink aria-label="login" href="/auth/sign-in" size="icon" variant="outline" />}>
          <LogInIcon />
        </TooltipTrigger>
        <TooltipContent>登录</TooltipContent>
      </Tooltip>
    )
  }

  if (session.user.role == 'admin') {
    return (
      <ButtonLink aria-label="dashboard" href="/dashboard" size="icon" variant="outline">
        <LayoutDashboardIcon />
      </ButtonLink>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<ButtonLink aria-label="logout" href="/account/settings" size="icon" variant="outline" />}>
        <UserRoundCogIcon />
      </TooltipTrigger>
      <TooltipContent>个人资料</TooltipContent>
    </Tooltip>
  )
}
