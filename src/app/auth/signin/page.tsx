import Card from '@/components/layout/Card'
import { auth } from '@/lib/auth'
import { GitHub } from '@mui/icons-material'
import { Avatar, Button } from '@mui/joy'
import Image from 'next/image'
import Link from 'next/link'
import ButtonOAuthSignIn from './_components/ButtonOAuthSignIn'
import LinkTo from './_components/LinkTo'

export default async function Page() {
  const session = await auth()

  if (session?.user) {
    return (
      <section className="flex flex-col gap-y-5">
        <Card className="col-span-2 flex flex-col items-center gap-y-3 rounded-md p-4">
          <Avatar sx={{ '--Avatar-size': '7rem' }}>
            <Image priority alt={session.user.name || ''} height={200} src={session.user.image?.replace('https://', '/cdn/') || ''} width={200} />
          </Avatar>
          <p className="s-subtitle">{session.user.email}</p>
        </Card>
        <Button color="neutral" component={Link} href="/" variant="outlined">
          回到主页
        </Button>
        <LinkTo />
      </section>
    )
  }

  return (
    <section className="flex min-w-72 flex-col gap-y-4">
      {process.env.GITHUB_ID && process.env.GITHUB_SECRET ? (
        <ButtonOAuthSignIn startDecorator={<GitHub />} type="github">
          Continue With GitHub
        </ButtonOAuthSignIn>
      ) : (
        <p className="s-subtitle cursor-not-allowed rounded-md border border-red-200 bg-red-50 text-center leading-10 dark:border-red-800 dark:bg-red-950">
          GitHub: 缺少环境变量
        </p>
      )}
    </section>
  )
}
