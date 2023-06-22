import Card from '@/components/layout/Card'
import prisma from '@/lib/prisma'
import { Diversity3 } from '@mui/icons-material'
import { Button } from '@mui/joy'
import Link from 'next/link'

export default async function CardFriendLink() {
  const count = await prisma.friendLinks.count()

  return (
    <>
      {count > 0 ? (
        <Card className="flex flex-col gap-y-3 p-6">
          <Button component={Link} href="/friend-link" startDecorator={<Diversity3 />} variant="outlined">
            友链({count})
          </Button>
        </Card>
      ) : null}
    </>
  )
}
