import Card from '@/components/layout/Card'
import LeetCode from '@/components/svg-icon/LeetCode'
import Spotify from '@/components/svg-icon/Spotify'
import { Email, GitHub } from '@mui/icons-material'
import { Avatar, Button, IconButton, Tooltip, Typography } from '@mui/joy'
import Image from 'next/image'

export default function Developer() {
  return (
    <Card className="flex flex-col items-center p-6">
      <Avatar className="transition-transform duration-500 hover:rotate-[360deg]" sx={{ '--Avatar-size': '7rem' }}>
        <Image priority alt="Flysky12138" height={200} src="/cdn/avatars.githubusercontent.com/u/35610243?v=4" width={200} />
      </Avatar>
      <Typography className="mt-3 font-title font-normal" level="h3">
        Flysky
      </Typography>
      <Typography className="mt-1 font-title" level="body-sm">
        用于记录分享笔记的网站
      </Typography>
      <Button fullWidth className="mt-4" component="a" href="https://github.com/Flysky12138" startDecorator={<GitHub />} target="_blank">
        Flysky12138
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
