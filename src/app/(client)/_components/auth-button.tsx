'use client'

import { LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const AuthButton = () => {
  const session = useSession()

  if (session.status == 'loading') return <Skeleton className="size-9" />

  if (session.status != 'authenticated') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild aria-label="login" size="icon" variant="outline">
            <Link href="/auth/login">
              <LogIn />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>登录</TooltipContent>
      </Tooltip>
    )
  }

  if (session.data.role == 'ADMIN') {
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
          <Link href="/auth/logout">
            <LogOut />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>注销</TooltipContent>
    </Tooltip>
  )
}
