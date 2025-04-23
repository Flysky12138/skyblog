'use client'

import { Button } from '@/components/ui/button'
import { useIsClient } from '@/hooks/use-is-client'
import { useTheme } from '@/hooks/use-theme'
import { VIEW_TRANSITION_NAME } from '@/lib/constants'
import { MoonStar, Sun } from 'lucide-react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'

import './view-transition.css'

/**
 * Adding dark mode to your next app.
 * @see https://www.shadcn.com.cn/docs/dark-mode/next
 */
export const ThemeProvider = (props: React.PropsWithChildren) => {
  return <NextThemesProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system" {...props} />
}

export const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme()

  const isClient = useIsClient()
  if (!isClient) return <span className="skeleton size-8 rounded-md" />

  return (
    <Button
      size="icon"
      variant="outline"
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
    >
      {isDark ? <MoonStar /> : <Sun />}
    </Button>
  )
}
