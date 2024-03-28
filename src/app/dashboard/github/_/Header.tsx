import ScrollChildrenClass from '@/components/scroll/ScrollChildrenClass'
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

  const id = React.useId()
  const [top, setTop] = React.useState(0)
  React.useEffect(() => {
    setTop(document.getElementById(id)?.offsetTop || 0)
  }, [id])

  return (
    <ScrollChildrenClass className="sticky !rounded-none border-t-0 transition-[border,border-radius]" selector="main" up={top}>
      <div
        className="s-border-color-card z-10 flex flex-wrap items-center gap-2 rounded-t-lg border bg-zinc-100 px-3 py-2 dark:bg-zinc-800"
        id={id}
        style={{
          top: `-${top}px`
        }}
      >
        <Link
          className="s-bg-slate s-divider-color rounded border px-2 text-sky-500"
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}/`}
          target="_blank"
        >
          {process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}
        </Link>
        <Breadcrumbs
          className="py-0 pl-0"
          slotProps={{
            li: {
              className: 'px-1 hover:s-bg-slate border rounded border-transparent hover:s-divider-color'
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
    </ScrollChildrenClass>
  )
}
