'use client'

import './view-transition.css'

import useIsClient from '@/hooks/useIsClient'
import useTheme from '@/hooks/useTheme'
import { DarkModeOutlined, LightMode } from '@mui/icons-material'
import { IconButton, IconButtonProps, Tooltip, TooltipProps } from '@mui/joy'

interface ToggleThemeProps {
  slotsProps?: Partial<{
    iconbutton: Pick<IconButtonProps, 'color'>
    tooltip: Pick<TooltipProps, 'placement'>
  }>
}

export default function ToggleTheme({ slotsProps }: ToggleThemeProps) {
  const { isDark, setTheme } = useTheme()

  const isClient = useIsClient()
  if (!isClient) return <span className="s-skeleton h-8 w-8 rounded-md"></span>

  return (
    <Tooltip title={isDark ? '白天' : '夜晚'} {...slotsProps?.tooltip}>
      <IconButton
        onClick={event => {
          const { clientX: x, clientY: y } = event
          const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
          try {
            // @ts-ignore
            const transition = document.startViewTransition(() => setTheme(isDark ? 'light' : 'dark'))
            transition.ready.then(() => {
              const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
              document.documentElement.animate(
                { clipPath: isDark ? clipPath : clipPath.reverse() },
                { duration: 500, easing: 'ease-in', pseudoElement: isDark ? '::view-transition-new(root)' : '::view-transition-old(root)' }
              )
            })
          } catch (error) {
            console.error(error)
            setTheme(isDark ? 'light' : 'dark')
          }
        }}
        {...slotsProps?.iconbutton}
      >
        {isDark ? <LightMode /> : <DarkModeOutlined />}
      </IconButton>
    </Tooltip>
  )
}
