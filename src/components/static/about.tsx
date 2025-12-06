'use cache'

import { cacheLife } from 'next/cache'
import Link, { LinkProps } from 'next/link'

interface OuterLinkProps extends LinkProps<never>, React.PropsWithChildren {}

export async function About() {
  cacheLife('max')

  return (
    <div className="text-muted-foreground/65 flex flex-col items-center gap-2 text-sm select-none">
      <span>©2020 - {new Date().getFullYear()} By Flysky</span>
      <div className="flex gap-1">
        <span>框架</span>
        <OuterLink href="https://nextjs.org">Next.js</OuterLink>
        <span>|</span>
        <span>主题</span>
        <OuterLink href="https://www.shadcn.com.cn">Shadcn</OuterLink>
      </div>
      <span className="text-xs">Built by vercel on {new Date().toUTCString()}</span>
    </div>
  )
}

function OuterLink({ children, ...props }: OuterLinkProps) {
  return (
    <Link
      className="text-link-foreground decoration-wavy underline-offset-2 hover:underline"
      rel="noreferrer nofollow"
      tabIndex={-1}
      target="_blank"
      {...props}
    >
      {children}
    </Link>
  )
}
