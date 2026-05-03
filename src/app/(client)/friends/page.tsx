'use cache'

import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

import { Card } from '@/components/static/card'
import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

export default async function Page() {
  cacheLife('max')
  cacheTag(CACHE_TAG.FRIENDS)

  const friends = await prisma.friend.findMany({
    where: { isActive: true }
  })

  return friends.map(friend => (
    <figure key={friend.id} className="relative flex flex-col gap-1">
      <Card
        className="group relative aspect-video ring-cyan-500 transition-shadow focus-within:ring-2 hover:ring-2"
        render={<Link href={friend.siteUrl} rel="noreferrer nofollow" target="_blank" />}
      >
        <img
          alt={friend.name}
          className="absolute inset-0 transition-transform group-hover:scale-110"
          decoding="async"
          height={900}
          loading="lazy"
          src={new URL(`/api/friends/${friend.id}/cover`, process.env.NEXT_PUBLIC_WEBSITE_URL).href}
          width={1600}
        />
      </Card>
      <figcaption className="font-heading text-xl">{friend.name}</figcaption>
    </figure>
  ))
}
