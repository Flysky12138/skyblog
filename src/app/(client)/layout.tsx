import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from 'ui/button'

import { DisplayByAuth } from '@/components/display/display-by-auth'
import { DisplayByBreakPoint } from '@/components/display/display-by-breakpoint'
import { About } from '@/components/layout/about'
import { Container } from '@/components/layout/container'
import { Header } from '@/components/layout/header'
import { Logo } from '@/components/layout/logo'
import { ScrollToTop } from '@/components/scroll-to-top'
import { TransitionCollapse } from '@/components/transition/transition-collapse'
import { ATTRIBUTE } from '@/lib/constants'
import { Live2DContent, Live2DProvider, Live2DToggleButton } from '@/providers/live2d'
import { ThemeToggleButton } from '@/providers/theme'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Live2DProvider>
      <Header>
        <Container className="flex h-full items-center gap-4">
          <Link href="/">
            <Logo />
          </Link>
          <span aria-hidden="true" className="grow" />
          <DisplayByBreakPoint up="sm">
            <ScrollToTop showOnScrollYOverflow={500} variant="outline" />
          </DisplayByBreakPoint>
          <DisplayByAuth role="ADMIN">
            <TransitionCollapse orientation="horizontal">
              <Button asChild aria-label="dashboard" size="icon" variant="outline">
                <Link href="/dashboard">
                  <LayoutDashboard />
                </Link>
              </Button>
            </TransitionCollapse>
            <hr className="bg-divide h-4 w-0.5 rounded-full" />
          </DisplayByAuth>
          <div className="empty:hidden" id={ATTRIBUTE.ID.ISSUES_MOBILE} />
          <Live2DToggleButton />
          <ThemeToggleButton />
        </Container>
      </Header>
      <main className="border-divide bg-root z-main relative mt-(--height-header) mb-(--height-footer) min-h-[calc(100dvh-var(--height-header))] border-b">
        <Container className="py-4 sm:py-6 md:py-9">{children}</Container>
        {/* <DisplayByBreakPoint down="md">
          <Ribbon />
        </DisplayByBreakPoint> */}
      </main>
      <nav className="z-nav fixed inset-x-0 bottom-[calc(var(--height-footer)+--spacing(12))]">
        <Container className="flex h-0 flex-col items-end justify-end gap-3" variant="nav">
          <div id={ATTRIBUTE.ID.ISSUES_PC} />
          <DisplayByBreakPoint down="sm">
            <ScrollToTop />
          </DisplayByBreakPoint>
        </Container>
      </nav>
      <footer className="z-footer h-footer fixed inset-x-0 bottom-0 flex items-center justify-center">
        <About />
        {/* <DisplayByBreakPoint down="md">
          <Fish />
        </DisplayByBreakPoint> */}
      </footer>
      <aside>
        <Live2DContent />
      </aside>
    </Live2DProvider>
  )
}
