import Link from 'next/link'
import React from 'react'

import { DisplayByBreakPoint } from '@/components/display/display-by-breakpoint'
import { About } from '@/components/layout/about'
import { Container } from '@/components/layout/container'
import { Header } from '@/components/layout/header'
import { Logo } from '@/components/layout/logo'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Live2DContent, Live2DProvider, Live2DToggleButton } from '@/providers/live2d'
import { ThemeToggleButton } from '@/providers/theme'

import { AuthButton } from './_components/auth-button'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Live2DProvider>
      <Header>
        <Container className="flex h-full items-center gap-4">
          <Link aria-label="to home page" href="/">
            <Logo />
          </Link>
          <span aria-hidden="true" className="grow" />
          <DisplayByBreakPoint max="sm">
            <ScrollToTop showOnScrollYOverflow={500} variant="outline" />
          </DisplayByBreakPoint>
          {/* <Button asChild aria-label="tools" size="icon" variant="outline">
            <Link href="/tools">
              <ToolCase />
            </Link>
          </Button>
          <hr className="bg-divide h-4 w-0.5 rounded-full" /> */}
          <Live2DToggleButton />
          <ThemeToggleButton />
          <AuthButton />
        </Container>
      </Header>
      <main className="border-divide bg-root z-main relative mt-(--height-header) mb-(--height-footer) min-h-[calc(100dvh-var(--height-header))] border-b">
        <Container className="py-5 sm:py-7 md:py-9">{children}</Container>
        {/* <DisplayByBreakPoint min="md">
          <RibbonCanvas />
        </DisplayByBreakPoint> */}
      </main>
      <nav className="z-nav fixed inset-x-0 bottom-[calc(var(--height-footer)+--spacing(12))]">
        <Container className="flex h-0 flex-col items-end justify-end gap-3" variant="nav">
          <DisplayByBreakPoint min="sm">
            <ScrollToTop />
          </DisplayByBreakPoint>
        </Container>
      </nav>
      <footer className="z-footer dark:bg-root/80 h-footer fixed inset-x-0 bottom-0 flex items-center justify-center bg-white/70">
        <About />
        {/* <DisplayByBreakPoint min="md">
          <FishCanvas />
        </DisplayByBreakPoint> */}
      </footer>
      <aside>
        <Live2DContent />
      </aside>
    </Live2DProvider>
  )
}
