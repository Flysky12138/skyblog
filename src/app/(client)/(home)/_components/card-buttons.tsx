'use cache'

import { Handshake, Package } from 'lucide-react'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui/button'
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
        <Button asChild variant="outline">
          <Link href="/friends">
            <Handshake /> 友链（{friendCount}）
          </Link>
        </Button>
      </DisplayByConditional>
      <Button asChild variant="outline">
        <Link href="/packages">
          <Package /> 项目依赖（{pkgCount}）
        </Link>
      </Button>
    </Card>
  )
}
