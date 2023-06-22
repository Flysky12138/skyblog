import { Home } from '@mui/icons-material'
import { Breadcrumbs } from '@mui/joy'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

interface HeaderProps {
  children: React.ReactNode
}

export default function Header({ children }: HeaderProps) {
  const [_, copy] = useCopyToClipboard()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const path = searchParams.get('path') || ''
  const paths = path.split('/').filter(v => v) || []

  return (
    <div className="s-bg-title s-border-color-card z-10 flex flex-wrap items-center gap-2 border-b-2 px-3 py-2">
      <Link
        className="s-bg-content s-border-color-divider rounded border px-2 text-sky-500"
        href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}/`}
        target="_blank"
      >
        {process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}
      </Link>
      <Breadcrumbs
        className="py-0 pl-0"
        slotProps={{
          li: {
            className: '[&>*]:px-1 hover:s-bg-content rounded border [&:not(:hover)]:!border-transparent s-border-color-divider'
          },
          separator: {
            className: 'opacity-30'
          }
        }}
        sx={{
          '--Breadcrumbs-gap': '2px'
        }}
      >
        {paths.length > 0 && (
          <Link className="text-sky-500" href={pathname}>
            <Home className="mb-0.5 text-lg" />
          </Link>
        )}
        {paths.map((item, index) => (
          <React.Fragment key={item}>
            {paths.length == index + 1 ? (
              <span
                className="cursor-copy"
                onClick={event => {
                  const target = event.target as HTMLElement
                  if (!target.textContent) return
                  copy(target.textContent)
                  toast.success('复制成功')
                }}
              >
                {decodeURIComponent(item)}
              </span>
            ) : (
              <Link className="text-sky-500" href={`${pathname}?path=${paths.slice(0, index + 1).join('/')}`}>
                {decodeURIComponent(item)}
              </Link>
            )}
          </React.Fragment>
        ))}
      </Breadcrumbs>
      <div className="ml-auto flex shrink-0 items-center gap-x-3">{children}</div>
    </div>
  )
}
