'use client'

import { cn } from '@/lib/cn'
import { KeyboardArrowRight } from '@mui/icons-material'
import { Box, List, ListItem, ListItemButton, ListItemButtonProps, ListItemContent, ListItemDecorator } from '@mui/joy'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import React from 'react'
import { useToggle } from 'react-use'

interface MenuProps {
  className?: string
  lists: XOR<
    { href: string; icon: React.ReactElement; label: string },
    { children: { href: string; label: string }[] } & Omit<ListItemExpandProps, 'children'>
  >[]
}

export default function Menu({ className, lists }: MenuProps) {
  return (
    <List
      className={cn('select-none overflow-y-auto overflow-x-hidden first:[&>li]:mt-0', className)}
      size="sm"
      sx={{
        '--List-gap': '10px',
        '--ListItem-radius': '8px'
      }}
    >
      {lists.map((it, index) => (
        <React.Fragment key={index}>
          {it.href ? (
            <ListItem>
              <ListItemLink href={it.href}>
                <ListItemDecorator>{it.icon}</ListItemDecorator>
                <ListItemContent>{it.label}</ListItemContent>
              </ListItemLink>
            </ListItem>
          ) : (
            <ListItem nested>
              <ListItemExpand defaultExpanded={it.defaultExpanded} icon={it.icon} label={it.label}>
                <List>
                  {it.children?.map(({ href, label }, index) => (
                    <ListItem key={index}>
                      <ListItemLink href={href}>
                        {({ isSelected }) => (
                          <>
                            <ListItemDecorator
                              className={cn('relative h-full', {
                                'before:absolute before:inset-y-1 before:left-2 before:z-10 before:border before:border-dashed before:border-white': isSelected
                              })}
                            />
                            <ListItemContent>{label}</ListItemContent>
                          </>
                        )}
                      </ListItemLink>
                    </ListItem>
                  ))}
                </List>
              </ListItemExpand>
            </ListItem>
          )}
        </React.Fragment>
      ))}
    </List>
  )
}

interface ListItemExpandProps {
  children?: React.ReactNode
  /**
   * true - 默认打开；string - 活动路由段匹配时打开
   * @default false
   */
  defaultExpanded?: boolean | string
  icon: React.ReactElement
  label: string
}

const ListItemExpand: React.FC<ListItemExpandProps> = ({ children, defaultExpanded = false, icon, label }) => {
  const segment = useSelectedLayoutSegment()

  const [open, openToggle] = useToggle(typeof defaultExpanded == 'boolean' ? defaultExpanded : segment == defaultExpanded)

  const boxRef = React.useRef<HTMLElement>()
  React.useEffect(() => {
    const target = boxRef.current as HTMLElement
    target.classList.toggle('invisible', !open)
    target.style.height = `${open ? target.scrollHeight : 0}px`
  }, [open])

  return (
    <>
      <ListItemButton className="mt-0" onClick={openToggle}>
        <ListItemDecorator>{icon}</ListItemDecorator>
        <ListItemContent>{label}</ListItemContent>
        <KeyboardArrowRight
          className={cn('transition-transform', {
            'rotate-90 text-sky-600 dark:text-sky-400': open
          })}
        />
      </ListItemButton>
      <Box
        ref={boxRef}
        aria-expanded={open}
        className={cn(
          'invisible relative -mx-2 h-0 overflow-y-clip px-2 transition-[height,visibility]',
          'before:absolute before:bottom-0 before:left-[calc(theme(height.4)+1px)] before:top-1.5 before:z-10',
          'before:s-border-color-divider before:border before:border-dashed'
        )}
        sx={{
          '.MuiList-root': {
            marginTop: 0,
            paddingBottom: 1
          },
          '.MuiListItem-root': {
            marginTop: 'var(--List-gap)'
          }
        }}
      >
        {children}
      </Box>
    </>
  )
}

interface ListItemLinkProps extends Omit<ListItemButtonProps, 'selected' | 'children'> {
  children:
    | React.ReactNode
    | React.FC<{
        isSelected: boolean
      }>
  href: string
}

const ListItemLink: React.FC<ListItemLinkProps> = ({ className, href, children, ...props }) => {
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
      {typeof children == 'function' ? children({ isSelected }) : children}
    </ListItemButton>
  )
}
