'use cache'

import { Handshake, Package } from 'lucide-react'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

import packageJson from '@/../package.json'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui/button'
import { CacheTag } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

export const CardButtons = async () => {
  cacheLife('max')
  cacheTag(CacheTag.FRIEND)

  const friendCount = await prisma.friend.count()

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
