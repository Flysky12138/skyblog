import { Home } from '@mui/icons-material'
import { Breadcrumbs } from '@mui/joy'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Breadcrumb() {
  const { slug } = useParams<{ slug?: string[] }>()

  return (
    <Breadcrumbs
      className="mb-2 px-0 py-0"
      slotProps={{
        li: {
          className: '[&>*]:px-1 rounded border border-transparent hover:s-bg-content hover:s-border-color-divider'
        },
        separator: {
          className: 'opacity-30'
        }
      }}
      sx={{
        '--Breadcrumbs-gap': '2px'
      }}
    >
      <Link replace href="/dashboard/r2">
        <Home className="mb-0.5 text-lg" color="primary" />
      </Link>
      {slug?.map((item, index) => (
        <React.Fragment key={item}>
          {slug.length == index + 1 ? (
            <span>{decodeURIComponent(item)}</span>
          ) : (
            <Link replace className="text-sky-500" href={`/dashboard/r2/${slug.slice(0, index + 1).join('/')}`}>
              {decodeURIComponent(item)}
            </Link>
          )}
        </React.Fragment>
      ))}
    </Breadcrumbs>
  )
}
