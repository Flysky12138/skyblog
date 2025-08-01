import { Github, House, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

import { OAuthSignInButton } from './_components/oauth-signin-button'

export default async function Page() {
  const session = await auth()

  if (session?.user) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar className="bg-secondary size-28">
          <AvatarImage loading="lazy" src={session.user.image?.replace('https://', '/cdn/')} />
          <AvatarFallback />
        </Avatar>
        <p>{session.user.name}</p>
        <p>{session.user.email}</p>
        <div className="mt-4 space-x-4">
          <Button asChild size="icon" variant="outline">
            <Link replace href="/">
              <House />
            </Link>
          </Button>
          <Button asChild size="icon" variant="outline">
            <Link replace href="/dashboard">
              <LayoutDashboard />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <OAuthSignInButton provider="github">
        <Github /> Continue With GitHub
      </OAuthSignInButton>
    </div>
  )
}
