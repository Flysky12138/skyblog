'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'

/**
 * Adding dark mode to your next app.
 * @see https://www.shadcn.com.cn/docs/dark-mode/next
 */
export const ThemeProvider = (props: React.PropsWithChildren) => {
  return <NextThemesProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system" {...props} />
}
