import Card from '@/components/layout/Card'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

export default async function Page() {
  const friendlinks = await prisma.friendLinks.findMany()

  return friendlinks.map(friendlink => (
    <Card
      key={friendlink.id}
      className="group aspect-video overflow-hidden ring-cyan-500 transition-shadow hover:ring"
      component={Link}
      // @ts-ignore
      href={friendlink.url}
      target="_blank"
    >
      {friendlink.cover ? (
        <Image alt={friendlink.name} className="transition-transform group-hover:scale-110" height={900} src={friendlink.cover} width={1600} />
      ) : null}
    </Card>
  ))
}
