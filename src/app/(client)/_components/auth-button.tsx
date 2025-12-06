'use client'

import { LayoutDashboard, LogIn, UserRoundCog } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { authClient } from '@/lib/auth/client'

export function AuthButton() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <Skeleton className="size-9" />

  if (!session) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild aria-label="login" size="icon" variant="outline">
            <Link href="/auth/sign-in">
              <LogIn />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>登录</TooltipContent>
      </Tooltip>
    )
  }

  if (session.user.role == 'admin') {
    return (
      <Button asChild aria-label="dashboard" size="icon" variant="outline">
        <Link href="/dashboard">
          <LayoutDashboard />
        </Link>
      </Button>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild aria-label="logout" size="icon" variant="outline">
          <Link href="/account/settings">
            <UserRoundCog />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>个人资料</TooltipContent>
    </Tooltip>
  )
}
