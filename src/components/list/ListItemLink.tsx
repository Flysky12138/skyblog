'use client'

import { cn } from '@/lib/cn'
import { ListItemButton, ListItemButtonProps } from '@mui/joy'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ListItemLinkProps extends Omit<ListItemButtonProps, 'selected'> {
  href: string
}

export default function ListItemLink({ className, href, children, ...props }: ListItemLinkProps) {
  const pathname = usePathname()
  const isSelected = pathname == href

  return (
    <ListItemButton
      className={cn(
        {
          'before:absolute before:inset-y-1 before:-left-2 before:w-1 before:rounded-lg before:bg-current before:opacity-80': isSelected,
          'text-sky-600 dark:text-sky-400': isSelected
        },
        className
      )}
      component={Link}
      href={href}
      scroll={false}
      selected={isSelected}
      {...props}
    >
      {children}
    </ListItemButton>
  )
}
