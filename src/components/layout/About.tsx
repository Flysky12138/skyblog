import { Typography } from '@mui/joy'
import Link, { LinkProps } from 'next/link'

interface OuterLinkProps extends LinkProps {
  children: React.ReactNode
}

const OuterLink: React.FC<OuterLinkProps> = ({ children, ...props }) => {
  return (
    <Typography
      className="text-sky-500 decoration-wavy underline-offset-2 hover:underline"
      component={Link}
      level="body-sm"
      rel="noreferrer nofollow"
      tabIndex={-1}
      target="_blank"
      {...props}
    >
      {children}
    </Typography>
  )
}

export default function About() {
  return (
    <section className="flex select-none flex-col items-center gap-y-2 opacity-60">
      <Typography level="body-sm">©2020 - {new Date().getFullYear()} By Flysky</Typography>
      <div className="flex gap-x-1">
        <Typography level="body-sm">框架</Typography>
        <OuterLink href="https://nextjs.org/">Next</OuterLink>
        <Typography level="body-sm">|</Typography>
        <Typography level="body-sm">主题</Typography>
        <OuterLink href="https://mui.com/joy-ui/getting-started/overview/">Joy UI</OuterLink>
      </div>
      <OuterLink href="https://beian.miit.gov.cn">蜀 ICP 备 2023031507 号</OuterLink>
      <Typography level="body-xs">Built by vercel on {new Date().toUTCString()}</Typography>
    </section>
  )
}
