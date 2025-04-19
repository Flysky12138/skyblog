'use client'

import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAsyncFn } from 'react-use'
import { toast } from 'sonner'

export default function Page() {
  const router = useRouter()
  const session = useSession()

  const [{ loading }, handleSignOut] = useAsyncFn(signOut)

  if (session.status == 'unauthenticated') {
    toast.error('未登陆')
    router.replace('/auth/signin')
  }

  return (
    <Button
      className="min-w-3xs"
      disabled={session.status == 'loading' || loading}
      size="lg"
      variant="destructive"
      onClick={() => {
        handleSignOut()
      }}
    >
      {loading ? '正在退出登陆...' : '退出登陆'}
    </Button>
  )
}
