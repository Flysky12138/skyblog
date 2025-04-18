import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { Github, House, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { OAuthSignInButton } from './_components/oauth-signin-button'

export default async function Page() {
  const session = await auth()

  if (session?.user) {
    return (
      <table>
        <tr>
          <th className="text-subtitle-foreground px-6 py-3" scope="row">
            avatar
          </th>
          <td>
            <Avatar className="bg-secondary size-28">
              <AvatarImage loading="lazy" src={session.user.image?.replace('https://', '/cdn/')} />
              <AvatarFallback />
            </Avatar>
          </td>
        </tr>
        <tr>
          <th className="text-subtitle-foreground px-6 py-3" scope="row">
            name
          </th>
          <td>{session.user.name}</td>
        </tr>
        <tr>
          <th className="text-subtitle-foreground px-6 py-3" scope="row">
            email
          </th>
          <td>{session.user.email}</td>
        </tr>
        <tr>
          <th scope="row" />
          <td className="space-x-5 pt-6">
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
          </td>
        </tr>
      </table>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <OAuthSignInButton provider="github">
        <Github /> Continue With GitHub
      </OAuthSignInButton>
    </section>
  )
}
