import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Prisma } from '@/generated/prisma/client'

interface PostCategroyTagProps {
  icon: LucideIcon
  queryKey: Extract<keyof Prisma.PostWhereInput, 'categories' | 'tags'>
  values: { id: string; name: string }[]
}

export function PostCategroyTag({ icon: Icon, queryKey, values }: PostCategroyTagProps) {
  if (values.length === 0) return null

  return (
    <>
      <span>·</span>
      <Icon size={12} />
      {values.map(({ id, name }, index) => (
        <span key={id}>
          <Link
            className="hover:text-link-foreground focus-visible:text-link-foreground"
            href={{
              pathname: '/',
              query: {
                [queryKey]: name
              }
            }}
          >
            {name}
          </Link>
          {index < values.length - 1 ? ',' : null}
        </span>
      ))}
    </>
  )
}
