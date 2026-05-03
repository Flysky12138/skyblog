'use cache'

import { HandshakeIcon, PackageIcon } from 'lucide-react'
import { cacheLife, cacheTag } from 'next/cache'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { ButtonLink } from '@/components/ui-overwrite/button'
import { CACHE_TAG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import packageJson from '~/package.json'

export async function CardButtons() {
  cacheLife('max')
  cacheTag(CACHE_TAG.FRIENDS)

  const friendCount = await prisma.friend.count({
    where: { isActive: true }
  })

  const pkgCount = Object.keys(packageJson.dependencies).length + Object.keys(packageJson.devDependencies).length

  return (
    <Card className="p-card grid grid-cols-2 gap-3 sm:grid-cols-1">
      <DisplayByConditional condition={friendCount > 0}>
        <ButtonLink href="/friends" variant="outline">
          <HandshakeIcon data-icon="inline-start" /> 友链（{friendCount}）
        </ButtonLink>
      </DisplayByConditional>
      <ButtonLink href="/packages" variant="outline">
        <PackageIcon data-icon="inline-start" /> 项目依赖（{pkgCount}）
      </ButtonLink>
    </Card>
  )
}
