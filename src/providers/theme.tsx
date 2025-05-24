'use client'

import { MoonStar, Sun } from 'lucide-react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'
import { Button } from 'ui/button'

import { useIsClient } from '@/hooks/use-is-client'
import { useTheme } from '@/hooks/use-theme'

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
    <Button aria-label="theme toggle" size="icon" variant="outline" onClick={toggleTheme}>
      {isDark ? <MoonStar /> : <Sun />}
    </Button>
  )
}
