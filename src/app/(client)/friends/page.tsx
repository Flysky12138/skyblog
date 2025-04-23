import { Card } from '@/components/layout/card'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function Page() {
  const friends = await prisma.friend.findMany()

  return friends.map(friend => (
    <Card
      key={friend.id}
      asChild
      className="group relative aspect-video overflow-hidden ring-cyan-500 transition-shadow focus-within:ring-2 hover:ring-2"
    >
      <Link href={friend.url} rel="noreferrer nofollow" target="_blank">
        <img
          alt={friend.name}
          className="absolute inset-0 transition-transform group-hover:scale-110"
          height={900}
          src={new URL(`/api/friends/${friend.id}/cover`, process.env.NEXT_PUBLIC_WEBSITE_URL).href}
          width={1600}
        />
      </Link>
    </Card>
  ))
}
