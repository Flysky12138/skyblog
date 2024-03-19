import ScrollChildrenClass from '@/components/scroll/ScrollChildrenClass'
import { Breadcrumbs } from '@mui/joy'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'

interface HeaderProps {
  children: React.ReactNode
}

export default function Header({ children }: HeaderProps) {
  const [_, copy] = useCopyToClipboard()
  const params = useParams<{ path?: string[] }>()

  return (
    <ScrollChildrenClass className="sticky -top-8 !rounded-none border-t-0 transition-[border,border-radius]" selector="main" up={32}>
      <div className="s-border-card z-10 flex flex-wrap items-center gap-2 rounded-t-lg border bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
        <Link
          className="s-bg-slate s-divider s-link rounded border px-2"
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}/`}
          target="_blank"
        >
          {process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}
        </Link>
        <Breadcrumbs
          className="py-0 pl-0"
          slotProps={{
            li: {
              className: 'px-1 hover:s-bg-slate border rounded border-transparent hover:s-divider'
            },
            separator: {
              className: 'opacity-30'
            }
          }}
          sx={{
            '--Breadcrumbs-gap': '2px'
          }}
        >
          {params.path?.map((item, index) => (
            <React.Fragment key={item}>
              {params.path?.length == index + 1 ? (
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
                <Link className="s-link" href={`/dashboard/github/${params.path?.slice(0, index + 1).join('/')}`}>
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
