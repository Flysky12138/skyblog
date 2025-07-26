'use client'

import { LogIn, LogOut } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const AuthButton = () => {
  const session = useSession()

  if (session.status != 'authenticated') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild size="icon" variant="outline">
            <Link href="/auth/login">
              <LogIn />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>登录</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild size="icon" variant="outline">
          <Link href="/auth/logout">
            <LogOut />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>注销</TooltipContent>
    </Tooltip>
  )
}
