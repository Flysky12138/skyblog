'use cache'

import { Octokit } from '@octokit/rest'
import { Mail } from 'lucide-react'
import { cacheLife } from 'next/cache'

import Github from '@/assets/svg/github.svg'
import LeetCode from '@/assets/svg/leetcode.svg'
import Spotify from '@/assets/svg/spotify.svg'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { file2base64 } from '@/lib/parser/transcode'

export const CardDeveloper = async () => {
  cacheLife('max')

  const octokit = new Octokit()
  const { data } = await octokit.users.getByUsername({ username: process.env.NEXT_PUBLIC_GITHUB_NAME })

  const avatar = await fetch(data.avatar_url)
    .then(res => res.blob())
    .then(file2base64)

  return (
    <Card className="p-card flex flex-col items-center">
      <div className="bg-secondary size-28 rounded-full transition-transform duration-500 hover:rotate-360 focus:rotate-360">
        <img alt={data.login} src={avatar} />
      </div>
      <p className="font-title mt-3 text-2xl">Flysky</p>
      <p className="font-title text-subtitle-foreground mt-1 text-sm">{process.env.NEXT_PUBLIC_DESCRIPTION}</p>
      <Button asChild className="mt-4 w-full max-w-56 font-bold">
        <a href={data.html_url} rel="noreferrer nofollow" target="_blank">
          <Github /> {data.login}
        </a>
      </Button>
      <div className="mt-4 flex gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" variant="secondary">
                <a aria-label="leetcode" href="https://leetcode.cn/u/flysky12138" rel="noreferrer nofollow" target="_blank">
                  <LeetCode />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">LeetCode</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" variant="secondary">
                <a aria-label="spotify" href="https://open.spotify.com/user/312ckxkwqn2ztud3zjzqwkhkqgrq" rel="noreferrer nofollow" target="_blank">
                  <Spotify />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Spotify</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" variant="secondary">
                <a aria-label="google email" href="mailto:xhp443@gmail.com" rel="noreferrer nofollow">
                  <Mail />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Google Email</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  )
}
