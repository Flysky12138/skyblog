'use cache'

import Github from '@/assets/svg/github.svg'
import LeetCode from '@/assets/svg/leetcode.svg'
import Spotify from '@/assets/svg/spotify.svg'
import { Card } from '@/components/layout/card'
import { Octokit } from '@octokit/rest'
import { Mail } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from 'ui/avatar'
import { Button } from 'ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'ui/tooltip'

export const CardDeveloper = async () => {
  const octokit = new Octokit()
  const { data } = await octokit.users.getByUsername({ username: process.env.NEXT_PUBLIC_GITHUB_NAME })

  return (
    <Card className="flex flex-col items-center p-6">
      <Avatar className="bg-secondary size-28 transition-transform duration-500 hover:rotate-[360deg] focus:rotate-[360deg]" tabIndex={-1}>
        <link as="image" fetchPriority="high" href={data.avatar_url.replace('https://', '/cdn/')} rel="preload" type="image/png" />
        <AvatarImage alt={data.login} src={data.avatar_url.replace('https://', '/cdn/')} />
        <AvatarFallback />
      </Avatar>
      <p className="font-title mt-3 text-2xl">Flysky</p>
      <p className="font-title text-subtitle-foreground mt-1 text-sm">{process.env.NEXT_PUBLIC_DESCRIPTION}</p>
      <Button asChild className="mt-4 w-full font-bold">
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
