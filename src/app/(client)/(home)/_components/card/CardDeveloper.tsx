import Card from '@/components/layout/Card'
import LeetCode from '@/components/svg-icon/LeetCode'
import Spotify from '@/components/svg-icon/Spotify'
import { Email, GitHub } from '@mui/icons-material'
import { Avatar, Button, IconButton, Tooltip, Typography } from '@mui/joy'
import { Octokit } from '@octokit/rest'
import Image from 'next/image'

export default async function CardDeveloper() {
  const octokit = new Octokit()
  const { data } = await octokit.users.getByUsername({ username: process.env.NEXT_PUBLIC_GITHUB_NAME })

  return (
    <Card className="flex flex-col items-center p-6">
      <Avatar className="transition-transform duration-500 hover:rotate-[360deg]" sx={{ '--Avatar-size': '7rem' }}>
        <Image priority alt={data.login} height={200} src={data.avatar_url.replace('https://', '/cdn/')} width={200} />
      </Avatar>
      <Typography className="mt-3 font-title font-normal" level="h3">
        Flysky
      </Typography>
      <Typography className="mt-1 font-title" level="body-sm">
        {process.env.NEXT_PUBLIC_DESCRIPTION}
      </Typography>
      <Button fullWidth className="mt-4" component="a" href={data.html_url} startDecorator={<GitHub />} target="_blank">
        {data.login}
      </Button>
      <div className="mt-4 flex gap-x-4">
        <Tooltip title="LeetCode">
          <IconButton component="a" href="https://leetcode.cn/u/flysky12138" target="_blank">
            <LeetCode />
          </IconButton>
        </Tooltip>
        <Tooltip title="Spotify">
          <IconButton component="a" href="https://open.spotify.com/user/312ckxkwqn2ztud3zjzqwkhkqgrq" target="_blank">
            <Spotify />
          </IconButton>
        </Tooltip>
        <Tooltip title="Google Email">
          <IconButton component="a" href="mailto:xhp443@gmail.com">
            <Email />
          </IconButton>
        </Tooltip>
      </div>
    </Card>
  )
}
