import { Github, House, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

import { OAuthSignInButton } from './_components/oauth-signin-button'

export default async function Page() {
  const session = await auth()

  if (session?.user) {
    const { email, image, name } = session.user
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Avatar className="bg-secondary size-28">
          <AvatarImage alt={name || undefined} loading="lazy" src={image || undefined} />
          <AvatarFallback />
        </Avatar>
        <p>{name}</p>
        <p>{email}</p>
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
