'use client'

import { useMounted } from '@repo/react-hooks'
import { LaptopMinimalIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'

import { Button, buttonVariants } from '../components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '../components/dropdown-menu'
import { useTheme } from '../hooks/use-theme'

export function DropdownMenuThemeRadio({
  render,
  skeleton,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger> & {
  skeleton?: React.ReactNode
}) {
  const { theme, ThemeIcon, toggleTheme } = useTheme()

  const isMounted = useMounted()
  if (!isMounted) return skeleton ?? <div className={buttonVariants({ className: 'pointer-events-none', size: 'icon', variant: 'outline' })} />

  render ??= (
    <Button aria-label="theme toggle" size="icon" variant="outline">
      <ThemeIcon />
    </Button>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={render} {...props} />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={toggleTheme}>
            <DropdownMenuRadioItem value="light">
              <SunIcon />
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <MoonStarIcon />
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <LaptopMinimalIcon />
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Adding dark mode to your next app.
 *
 * @see https://www.shadcn.com.cn/docs/dark-mode/next
 */
export function ThemeProvider(props: React.PropsWithChildren) {
  return <NextThemesProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system" {...props} />
}
