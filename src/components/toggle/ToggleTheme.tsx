'use client'

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
      <IconButton onClick={() => setTheme(isDark ? 'light' : 'dark')} {...slotsProps?.iconbutton}>
        {isDark ? <LightMode /> : <DarkModeOutlined />}
      </IconButton>
    </Tooltip>
  )
}
