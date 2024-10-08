'use client'

import useIsClient from '@/hooks/useIsClient'
import useTheme from '@/hooks/useTheme'
import { DarkModeOutlined, LightMode } from '@mui/icons-material'
import { IconButton, IconButtonProps, Tooltip, TooltipProps } from '@mui/joy'
import './view-transition.css'

interface ToggleThemeProps {
  slotsProps?: Partial<{
    iconbutton: IconButtonProps
    tooltip: Omit<TooltipProps, 'children' | 'title'>
  }>
}

export default function ToggleTheme({ slotsProps }: ToggleThemeProps) {
  const { isDark, setTheme } = useTheme()

  const isClient = useIsClient()
  if (!isClient) return <span className="s-skeleton h-8 w-8 rounded-md"></span>

  return (
    <Tooltip title={isDark ? '夜晚' : '白天'} {...slotsProps?.tooltip}>
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
        {isDark ? <DarkModeOutlined /> : <LightMode />}
      </IconButton>
    </Tooltip>
  )
}
