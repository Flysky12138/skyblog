'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMounted } from '@/hooks/use-mounted'
import { useTheme } from '@/hooks/use-theme'

/**
 * Adding dark mode to your next app.
 * @see https://www.shadcn.com.cn/docs/dark-mode/next
 */
export function ThemeProvider(props: React.PropsWithChildren) {
  return <NextThemesProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system" {...props} />
}

export function ThemeToggleButton() {
  const { theme, themeIcon, toggleTheme } = useTheme()

  const isMounted = useMounted()
  if (!isMounted) return <Skeleton className="size-9" />

  return (
    <Button aria-label="theme toggle" data-theme={theme} size="icon" variant="outline" onClick={toggleTheme}>
      {themeIcon}
    </Button>
  )
}
