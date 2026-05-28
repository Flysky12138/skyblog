'use cache'

import { Card } from '@repo/ui/components-self/card'
import { CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

import { CACHE_TAG } from '@/lib/constants'
import { Storage } from '@/lib/http/storage'
import { prisma } from '@/lib/prisma'

export default async function Page() {
  cacheLife('max')
  cacheTag(CACHE_TAG.FRIENDS)

  const friends = await prisma.friend.findMany({
    where: { isEnabled: true },
    include: {
      screenshotFile: true
    }
  })

  return friends.map(friend => (
    <Link key={friend.id} className="group rounded-lg focus-visible:ring-3" href={friend.siteUrl} rel="noreferrer nofollow" target="_blank">
      <Card className="overflow-hidden rounded-[inherit]">
        {friend.screenshotFile && (
          <img
            alt={friend.name}
            className="origin-bottom transition-transform duration-300 group-hover:scale-120"
            decoding="async"
            height={friend.screenshotFile.metadata?.height}
            loading="lazy"
            src={Storage.getPublicUrl(friend.screenshotFile.id)}
            width={friend.screenshotFile.metadata?.width}
          />
        )}
        <CardHeader className="p-3">
          <CardTitle>{friend.name}</CardTitle>
          {friend.description && <CardDescription>{friend.description}</CardDescription>}
        </CardHeader>
      </Card>
    </Link>
  ))
}
