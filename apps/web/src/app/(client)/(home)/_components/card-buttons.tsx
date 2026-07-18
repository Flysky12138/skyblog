'use cache'

import { Card } from '@repo/ui/components-self/card'
import { ButtonLink } from '@repo/ui/components/button'
import { HandshakeIcon, PackageIcon } from 'lucide-react'
import { cacheLife, cacheTag } from 'next/cache'

import { Show } from '@/components/show'
import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import packageJson from '~/package.json'

export async function CardButtons() {
  cacheLife('max')
  cacheTag(CACHE_TAG.FRIENDS)

  const friendCount = await prisma.friend.count({
    where: { isEnabled: true }
  })

  const pkgCount = Object.keys(packageJson.dependencies).length + Object.keys(packageJson.devDependencies).length

  return (
    <Card className="grid grid-cols-2 gap-3 p-card sm:grid-cols-1">
      <Show when={friendCount > 0}>
        <ButtonLink href="/friends" variant="outline">
          <HandshakeIcon /> 友链（{friendCount}）
        </ButtonLink>
      </Show>
      <ButtonLink href="/packages" variant="outline">
        <PackageIcon /> 项目依赖（{pkgCount}）
      </ButtonLink>
    </Card>
  )
}
