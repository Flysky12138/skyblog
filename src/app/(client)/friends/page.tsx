'use cache'

import { Route } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

import { Card } from '@/components/static/card'
import { CacheTag } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

export default async function Page() {
  cacheLife('max')
  cacheTag(CacheTag.FRIEND)

  const friends = await prisma.friend.findMany()

  return friends.map(friend => (
    <figure key={friend.id} className="relative flex flex-col gap-1">
      <Card
        asChild
        className="group relative aspect-video overflow-hidden ring-cyan-500 outline-0 transition-shadow focus-within:ring-2 hover:ring-2"
      >
        <Link href={friend.url as Route} rel="noreferrer nofollow" target="_blank">
          <img
            alt={friend.name}
            className="absolute inset-0 transition-transform group-hover:scale-110"
            decoding="async"
            height={900}
            loading="lazy"
            src={new URL(`/api/friends/${friend.id}/cover`, process.env.NEXT_PUBLIC_WEBSITE_URL).href}
            width={1600}
          />
        </Link>
      </Card>
      <figcaption className="font-title text-xl">{friend.name}</figcaption>
    </figure>
  ))
}
