import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import noise from '@/assets/svg/noise.svg?url'
import { DisplayByAuth } from '@/components/display/display-by-auth'
import { DisplayByBreakPoint } from '@/components/display/display-by-breakpoint'
import { About } from '@/components/layout/about'
import { Container } from '@/components/layout/container'
import { Header } from '@/components/layout/header'
import { Logo } from '@/components/layout/logo'
import { ScrollToTop } from '@/components/scroll-to-top'
import { TransitionCollapse } from '@/components/transition/transition-collapse'
import { Button } from '@/components/ui/button'
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
        <span
          className="light:hidden pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${noise.src})`
          }}
        />
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
