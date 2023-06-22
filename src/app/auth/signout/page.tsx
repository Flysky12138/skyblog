'use client'

import Card from '@/components/layout/Card'
import { Button } from '@mui/joy'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToggle } from 'react-use'
import { toast } from 'sonner'

export default function Page() {
  const router = useRouter()
  const session = useSession()

  const [loading, loadingToggle] = useToggle(false)

  if (session.status == 'loading') return <Card className="s-skeleton h-11 min-w-72" />

  if (!session.data?.user) {
    toast.error('未登陆')
    router.replace('/auth/signin')
  }

  return (
    <Button
      className="min-w-72"
      color="danger"
      loading={loading}
      size="lg"
      variant="outlined"
      onClick={async () => {
        loadingToggle()
        await signOut({
          callbackUrl: '/auth/signin'
        })
      }}
    >
      退出登陆
    </Button>
  )
}
