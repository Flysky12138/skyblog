'use client'

import { cn } from '@/lib/cn'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Box, ListItemButton, ListItemContent, ListItemDecorator } from '@mui/joy'
import { useSelectedLayoutSegment } from 'next/navigation'
import React from 'react'
import { useToggle } from 'react-use'

interface ListItemExpandPropsType {
  children?: React.ReactNode
  /**
   * true - 默认打开；string - 活动路由段匹配时打开
   * @default false
   */
  defaultExpanded?: boolean | string
  icon: React.ReactElement
  label: string
}

export default function ListItemExpand({ children, defaultExpanded = false, icon, label }: ListItemExpandPropsType) {
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
        <KeyboardArrowDown
          className={cn({
            'rotate-180 text-sky-600 dark:text-sky-400': open
          })}
        />
      </ListItemButton>
      <Box
        ref={boxRef}
        aria-expanded={open}
        className="invisible -mx-2 h-0 overflow-y-clip px-2 transition-[height,visibility]"
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
