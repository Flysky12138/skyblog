'use client'

import useIsClient from '@/hooks/useIsClient'
import { useTheme } from '@mui/joy/styles'
import { useMediaQuery } from '@mui/material'
import { Breakpoint as BreakpointType } from '@mui/material/styles'
import React from 'react'

interface BreakpointProps {
  children: React.ReactNode
  down?: number | BreakpointType
  fallback?: React.ReactNode
  up?: number | BreakpointType
}

export default function Breakpoint({ children, up, down, fallback = null }: BreakpointProps) {
  const theme = useTheme()
  const breakpointUp = useMediaQuery(theme.breakpoints.up(up || 0))
  const breakpointDown = useMediaQuery(theme.breakpoints.down(down || 1e6))

  const isClient = useIsClient()
  if (fallback && !isClient) return <>{fallback}</>

  return <>{breakpointUp && breakpointDown ? children : null}</>
}
