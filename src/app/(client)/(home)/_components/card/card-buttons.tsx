import packageJson from '@/../package.json'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/layout/card'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { Handshake, Package } from 'lucide-react'
import Link from 'next/link'

export const CardButtons = async () => {
  const friendCount = await prisma.friend.count()

  const pkgCount = Object.keys(packageJson.dependencies).length + Object.keys(packageJson.devDependencies).length

  return (
    <Card className="flex flex-col gap-3 p-6">
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
