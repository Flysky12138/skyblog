'use cache'

import { Octokit } from '@octokit/rest'
import { MailIcon } from 'lucide-react'
import { cacheLife } from 'next/cache'

import Github from '@/assets/svg/github.svg'
import LeetCode from '@/assets/svg/leetcode.svg'
import Spotify from '@/assets/svg/spotify.svg'
import { Card } from '@/components/static/card'
import { ButtonLink } from '@/components/ui-overwrite/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export async function CardDeveloper() {
  cacheLife('weeks')

  const octokit = new Octokit()
  const { data } = await octokit.users.getByUsername({ username: process.env.NEXT_PUBLIC_GITHUB_NAME })

  return (
    <Card className="p-card flex flex-col items-center">
      <Avatar className={cn('ring-secondary size-28 ring-6', 'transition-transform duration-500 hover:rotate-360 active:rotate-360')}>
        <AvatarImage crossOrigin="anonymous" fetchPriority="high" height={460} src={data.avatar_url} width={460} />
        <AvatarFallback>{data.login}</AvatarFallback>
      </Avatar>
      <p className="font-heading text-muted-foreground mt-2 text-center text-sm whitespace-pre-line">{process.env.NEXT_PUBLIC_DESCRIPTION}</p>
      <ButtonLink className="mt-4 w-full max-w-56 font-bold" href={data.html_url} rel="noreferrer nofollow" target="_blank">
        <Github data-icon="inline-start" /> {data.login}
      </ButtonLink>
      <div className="mt-4 flex gap-4">
        <Tooltip>
          <TooltipTrigger
            render={
              <ButtonLink
                aria-label="leetcode"
                href="https://leetcode.cn/u/flysky12138"
                rel="noreferrer nofollow"
                size="icon"
                target="_blank"
                variant="secondary"
              />
            }
          >
            <LeetCode />
          </TooltipTrigger>
          <TooltipContent side="bottom">LeetCode</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <ButtonLink
                aria-label="spotify"
                href="https://open.spotify.com/user/312ckxkwqn2ztud3zjzqwkhkqgrq"
                rel="noreferrer nofollow"
                size="icon"
                target="_blank"
                variant="secondary"
              />
            }
          >
            <Spotify />
          </TooltipTrigger>
          <TooltipContent side="bottom">Spotify</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={<ButtonLink aria-label="google email" href="mailto:xhp443@gmail.com" rel="noreferrer nofollow" size="icon" variant="secondary" />}
          >
            <MailIcon />
          </TooltipTrigger>
          <TooltipContent side="bottom">Google Email</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  )
}
