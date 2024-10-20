'use client'

import useIsClient from '@/hooks/useIsClient'
import useTheme from '@/hooks/useTheme'
import { VIEW_TRANSITION_NAME } from '@/lib/constants'
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
  const { isDark, toggleTheme } = useTheme()

  const isClient = useIsClient()
  if (!isClient) return <span className="s-skeleton h-8 w-8 rounded-md"></span>

  return (
    <Tooltip title={isDark ? '夜晚' : '白天'} {...slotsProps?.tooltip}>
      <IconButton
        onClick={async event => {
          try {
            const { clientX: x, clientY: y } = event
            const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
            const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
            document.documentElement.style.viewTransitionName = VIEW_TRANSITION_NAME.THEME
            const transition = document.startViewTransition(toggleTheme)
            await transition.ready
            document.documentElement.animate(
              {
                clipPath: isDark ? clipPath : clipPath.reverse()
              },
              {
                duration: 500,
                easing: 'ease-in',
                pseudoElement: isDark ? `::view-transition-new(${VIEW_TRANSITION_NAME.THEME})` : `::view-transition-old(${VIEW_TRANSITION_NAME.THEME})`
              }
            )
          } catch (error) {
            console.error(error)
            toggleTheme()
          }
        }}
        {...slotsProps?.iconbutton}
      >
        {isDark ? <DarkModeOutlined /> : <LightMode />}
      </IconButton>
    </Tooltip>
  )
}
