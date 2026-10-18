'use client'

import { useMounted } from '@repo/react-hooks'
import { ThemeProvider as NextThemesProvider } from '@repo/ui/base'
import { Button, buttonVariants } from '@repo/ui/components/button'
import { useTheme } from '@repo/ui/hooks/use-theme'
import { cn } from '@repo/ui/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import React from 'react'

export function AnimatedIcon({
  children,
  className
}: React.PropsWithChildren<{
  className?: string
}>) {
  const { theme } = useTheme()

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={theme}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        className={className}
        exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
        initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
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

export function ThemeToggle({
  className,
  size = 'icon',
  skeleton,
  variant = 'outline',
  ...props
}: React.ComponentProps<typeof Button> & {
  skeleton?: React.ReactNode
}) {
  const { ThemeIcon, toggleTheme } = useTheme()

  const isMounted = useMounted()
  if (!isMounted) {
    return skeleton ?? <div className={buttonVariants({ className: 'pointer-events-none', size, variant })} />
  }

  return (
    <Button
      aria-label="theme toggle"
      className={cn('relative', className)}
      size={size}
      variant={variant}
      onClick={() => {
        toggleTheme()
      }}
      {...props}
    >
      <AnimatedIcon>
        <ThemeIcon />
      </AnimatedIcon>
    </Button>
  )
}
